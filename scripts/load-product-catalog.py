"""Load the TAF product snapshot inside a Django backend container.

This file deliberately lives in TAF rather than the backend repository. Docker
mounts it read-only and executes it with ``manage.py shell`` so the snapshot can
be used by any compatible backend revision without copying seed data into the
application repository.
"""

import hashlib
import json
import mimetypes
import os
from collections import defaultdict
from pathlib import Path
from urllib.parse import quote, unquote, urlparse

import boto3
from botocore.exceptions import ClientError
from django.db import transaction
from django.utils.text import slugify

from categories.infrastructure.models import Category
from products.infrastructure.models import Audience, Brand, GameType, Product, ProductImage


TRUE_VALUES = {"1", "true", "yes", "on"}
VALID_IMAGE_MODES = {"skip", "reference", "bucket"}
PRODUCTION_BUCKET = "bg-shop-images"


def env_bool(name, default=False):
    value = os.getenv(name)
    return default if value is None else value.lower() in TRUE_VALUES


def load_json(path):
    with path.open(encoding="utf-8") as source:
        return json.load(source)


def lookup_by_id(items):
    return {item["id"]: item for item in items}


def require_file(path, description):
    if not path.is_file():
        raise RuntimeError(f"Missing {description}: {path}")


def sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def object_key(source_url):
    return unquote(urlparse(source_url).path.lstrip("/"))


def public_url(domain, bucket, region, key):
    encoded_key = quote(key, safe="/")
    if domain:
        return f"https://{domain.strip('/')}/{encoded_key}"
    return f"https://{bucket}.s3.{region}.amazonaws.com/{encoded_key}"


def upload_if_needed(client, bucket, entry, snapshot_root, dry_run):
    local_path = snapshot_root / entry["relativePath"]
    require_file(local_path, "catalog image")

    expected_digest = entry["sha256"]
    actual_digest = sha256(local_path)
    if actual_digest != expected_digest:
        raise RuntimeError(
            f"Checksum mismatch for {local_path}: expected {expected_digest}, got {actual_digest}"
        )

    key = object_key(entry["sourceUrl"])
    if dry_run:
        return key, "would-upload"

    try:
        response = client.head_object(Bucket=bucket, Key=key)
        if response.get("Metadata", {}).get("sha256") == expected_digest:
            return key, "reused"
    except ClientError as error:
        error_code = error.response.get("Error", {}).get("Code")
        if error_code not in {"404", "NoSuchKey", "NotFound"}:
            raise

    content_type = mimetypes.guess_type(local_path.name)[0] or "application/octet-stream"
    client.upload_file(
        str(local_path),
        bucket,
        key,
        ExtraArgs={
            "CacheControl": "public,max-age=31536000,immutable",
            "ContentType": content_type,
            "Metadata": {
                "sha256": expected_digest,
                "snapshot-product-id": str(entry["productId"]),
                "snapshot-image-id": str(entry["imageId"]),
            },
        },
    )
    return key, "uploaded"


def group_manifest(entries):
    grouped = defaultdict(lambda: defaultdict(dict))
    for entry in entries:
        grouped[entry["productId"]][entry["imageId"]][entry["variant"]] = entry
    return grouped


def resolve_relation_names(product_data, id_field, name_field, lookup):
    explicit_names = product_data.get(name_field)
    if explicit_names is not None:
        return explicit_names
    return [lookup[item_id]["name"] for item_id in product_data.get(id_field, [])]


def get_or_create_named(model, name):
    existing = model.objects.filter(name__iexact=name).first()
    if existing:
        return existing
    return model.objects.create(name=name)


def get_or_create_category(name):
    existing = Category.objects.filter(slug=slugify(name)).first()
    if existing:
        return existing
    return Category.objects.create(name=name)


def upsert_product(product_data, brand):
    product = Product.objects.filter(slug=slugify(product_data["name"])).first()
    stock = max(0, int(product_data.get("stock", 0)))
    defaults = {
        "brand": brand,
        "description": product_data["description"],
        "price": product_data["price"],
        "discount": product_data.get("discount", "0.00"),
        "stock": stock,
        "stars": product_data.get("stars", "0.00"),
    }
    if product:
        product.name = product_data["name"]
        for field, value in defaults.items():
            setattr(product, field, value)
        product.save()
        return product, False
    return Product.objects.create(name=product_data["name"], **defaults), True


def sync_images(
    product,
    product_data,
    image_mode,
    manifest_by_product,
    snapshot_root,
    s3_client,
    bucket,
    domain,
    region,
    replace_images,
    dry_run,
    counters,
):
    if image_mode == "skip":
        return

    source_product_id = product_data.get("id")
    image_groups = manifest_by_product.get(source_product_id, {})
    if not image_groups:
        return

    if replace_images and not dry_run:
        product.images.all().delete()

    for variants in image_groups.values():
        required = {"original", "lg", "md", "sm"}
        if set(variants) != required:
            missing = sorted(required - set(variants))
            raise RuntimeError(f"Image {next(iter(variants.values()))['imageId']} misses: {missing}")

        original = variants["original"]
        urls = {}
        for variant in sorted(required):
            entry = variants[variant]
            if image_mode == "bucket":
                key, upload_status = upload_if_needed(
                    s3_client, bucket, entry, snapshot_root, dry_run
                )
                counters[upload_status] += 1
                urls[f"url_{variant}"] = public_url(domain, bucket, region, key)
            else:
                urls[f"url_{variant}"] = entry["sourceUrl"]

        if not dry_run:
            ProductImage.objects.update_or_create(
                product=product,
                sort=original["sort"],
                defaults={
                    **urls,
                    "alt": original.get("productName", product.name),
                },
            )
        counters["images"] += 1


def main():
    snapshot_root = Path(
        os.getenv("CATALOG_SNAPSHOT_DIR", "/taf/catalog")
    ).resolve()
    catalog_path = Path(
        os.getenv("CATALOG_FILE", snapshot_root / "performance-catalog-100.json")
    )
    lookups_path = Path(os.getenv("CATALOG_LOOKUPS_FILE", snapshot_root / "lookups.json"))
    manifest_path = Path(
        os.getenv("CATALOG_IMAGES_MANIFEST", snapshot_root / "images-manifest.json")
    )
    image_mode = os.getenv("CATALOG_IMAGE_MODE", "skip").lower()
    dry_run = env_bool("CATALOG_DRY_RUN")
    replace_images = env_bool("CATALOG_REPLACE_IMAGES")

    if image_mode not in VALID_IMAGE_MODES:
        raise RuntimeError(
            f"CATALOG_IMAGE_MODE must be one of {sorted(VALID_IMAGE_MODES)}, got {image_mode}"
        )

    require_file(catalog_path, "catalog JSON")
    require_file(lookups_path, "lookup JSON")
    if image_mode != "skip":
        require_file(manifest_path, "image manifest")

    products = load_json(catalog_path)
    lookups = load_json(lookups_path)
    manifest = load_json(manifest_path) if image_mode != "skip" else []
    manifest_by_product = group_manifest(manifest)

    category_lookup = lookup_by_id(lookups["categories"])
    brand_lookup = lookup_by_id(lookups["brands"])
    type_lookup = lookup_by_id(lookups["gameTypes"])
    audience_lookup = lookup_by_id(lookups["audiences"])

    bucket = os.getenv("CATALOG_BUCKET_NAME", "")
    domain = os.getenv("CATALOG_CDN_DOMAIN", "")
    region = os.getenv("AWS_S3_REGION_NAME", "eu-north-1")
    s3_client = None

    if image_mode == "bucket":
        if not bucket:
            raise RuntimeError("CATALOG_BUCKET_NAME is required for bucket mode")
        if bucket == PRODUCTION_BUCKET and not env_bool("CATALOG_ALLOW_PRODUCTION_BUCKET"):
            raise RuntimeError(
                "Refusing to write to the production bucket. Set "
                "CATALOG_ALLOW_PRODUCTION_BUCKET=true only for an intentional restore."
            )
        s3_client = boto3.client("s3", region_name=region)

    if dry_run:
        print(
            f"Catalog dry run: products={len(products)}, manifest_files={len(manifest)}, "
            f"image_mode={image_mode}, bucket={bucket or '-'}"
        )
        if image_mode == "bucket":
            for entry in manifest:
                upload_if_needed(s3_client, bucket, entry, snapshot_root, True)
        print("Catalog dry run passed")
        return

    counters = defaultdict(int)
    for product_data in products:
        if int(product_data.get("stock", 0)) < 0:
            counters["normalized_stock"] += 1
        brand_name = product_data.get("brand_name")
        if not brand_name:
            brand_name = brand_lookup[product_data["brand"]]["name"]

        category_names = resolve_relation_names(
            product_data, "categories", "category_names", category_lookup
        )
        type_names = resolve_relation_names(
            product_data, "types", "type_names", type_lookup
        )
        audience_names = resolve_relation_names(
            product_data, "audiences", "audience_names", audience_lookup
        )

        with transaction.atomic():
            brand = get_or_create_named(Brand, brand_name)
            product, created = upsert_product(product_data, brand)
            counters["created" if created else "updated"] += 1

            categories = [get_or_create_category(name) for name in category_names]
            types = [get_or_create_named(GameType, name) for name in type_names]
            audiences = [get_or_create_named(Audience, name) for name in audience_names]
            product.categories.set(categories)
            product.types.set(types)
            product.audiences.set(audiences)

            sync_images(
                product,
                product_data,
                image_mode,
                manifest_by_product,
                snapshot_root,
                s3_client,
                bucket,
                domain,
                region,
                replace_images,
                False,
                counters,
            )

    print(
        "Catalog load complete: "
        f"created={counters['created']}, updated={counters['updated']}, "
        f"images={counters['images']}, uploaded={counters['uploaded']}, "
        f"reused={counters['reused']}, normalized_stock={counters['normalized_stock']}"
    )


main()
