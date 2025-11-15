import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class ProductPage extends BasePage {
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly addToCartButton: Locator;
  readonly quantityInput: Locator;
  readonly imageGallery: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.locator('[data-testid="product-title"]');
    this.productPrice = page.locator('[data-testid="product-price"]');
    this.productDescription = page.locator('[data-testid="product-description"]');
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.quantityInput = page.locator('[data-testid="quantity-input"]');
    this.imageGallery = page.locator('[data-testid="image-gallery"]');
  }

  async addToCart(quantity: number = 1) {
    if (quantity > 1) {
      await this.quantityInput.fill(quantity.toString());
    }
    await this.addToCartButton.click();
  }

  async getPrice(): Promise<string> {
    return this.productPrice.textContent() || '';
  }

  async getTitle(): Promise<string> {
    return this.productTitle.textContent() || '';
  }

  async getDescription(): Promise<string> {
    return this.productDescription.textContent() || '';
  }
}