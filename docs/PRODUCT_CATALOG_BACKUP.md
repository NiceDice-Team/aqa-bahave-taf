# Product catalog backup

The catalog backup captures product data and every CDN image rendition used by
the deployed catalog. It is intended for local, test, staging, and disaster
recovery use.

## Create or resume a snapshot

```bash
npm run backup:products -- --output backups/product-catalog/YYYY-MM-DD
```

Optional parameters:

- `--api-base-url <url>` changes the source API (default: `https://bgshop.work.gd/api`).
- `--concurrency <1-50>` changes parallel image downloads (default: `12`).

The command is resumable. Existing image files are reused and checksummed; only
missing files are downloaded again.

## Snapshot contents

- `products.json`: complete public product records.
- `lookups.json`: categories, brands, game types, and audiences.
- `images/`: `original`, `lg`, `md`, and `sm` files for every product image.
- `images-manifest.json`: product/image IDs, original URLs, local paths, sizes,
  content types, download status, and SHA-256 checksums.
- `metadata.json`: source, creation time, record counts, byte totals, and failures.

Do not replace URLs in `products.json`; retaining the source representation makes
the snapshot auditable. Consumers should resolve local files through
`images-manifest.json` when loading a test environment.

## Performance catalog

Build a deterministic 100-product catalog from the production snapshot plus
curated, non-duplicate board games:

```bash
npm run seed:performance-products
```

This creates:

- `additional-performance-products.json`: 58 portable test-only product records.
- `performance-catalog-100.json`: the 42 backed-up records plus 58 additional records.
- `performance-seed-metadata.json`: counts, purpose, and research source URLs.

Additional descriptions are original test text rather than copied publisher
marketing content. The seed has no external product images and is not intended
for automatic production import.

## Load from TAF into a backend environment

TAF owns the loader and mounts both the loader and snapshot read-only into the
backend container. The backend submodule remains unchanged.

The normal local Docker seed loads all 100 products but skips object-storage
writes:

```bash
npm run docker:up
```

Run the loader independently in validation-only mode:

```bash
CATALOG_DRY_RUN=true npm run seed:catalog:docker
```

To copy the backed-up image renditions into a non-production S3 bucket and
write their URLs to the product image records:

```bash
CATALOG_IMAGE_MODE=bucket \
CATALOG_BUCKET_NAME=bg-shop-images-test \
CATALOG_CDN_DOMAIN=cdn-test.example.com \
AWS_S3_REGION_NAME=eu-north-1 \
npm run seed:catalog:docker
```

AWS credentials must come from the process environment, an AWS profile, or an
OIDC-provided role. Never store them in TAF. The uploader verifies every local
file against `images-manifest.json`, stores the SHA-256 in object metadata, and
skips matching objects on later runs.

Supported `CATALOG_IMAGE_MODE` values:

- `skip` (default): load catalog records without image records or bucket access.
- `reference`: load image records that reference the snapshot's original CDN URLs.
- `bucket`: upload the local files and load URLs for the selected bucket/CDN.

Set `CATALOG_REPLACE_IMAGES=true` to replace existing image rows for each loaded
product. Writes to the known production bucket are refused unless
`CATALOG_ALLOW_PRODUCTION_BUCKET=true` is explicitly supplied for an intentional
restore.
