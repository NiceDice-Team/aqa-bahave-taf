"""Keep disposable Docker seed data compatible with the pinned frontend."""

from categories.infrastructure.models import Category
from products.infrastructure.models import ProductImage


for category in Category.objects.all():
    category.image = "https://placehold.co/800x600"
    category.save(update_fields=["image"])

for image in ProductImage.objects.all():
    image.url_original = "https://placehold.co/800x600"
    image.url_lg = "https://placehold.co/600x400"
    image.url_md = "https://placehold.co/400x300"
    image.url_sm = "https://placehold.co/200x150"
    image.save(update_fields=["url_original", "url_lg", "url_md", "url_sm"])

print("Normalized local seed image URLs for the pinned frontend")
