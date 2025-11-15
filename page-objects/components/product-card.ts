import { Locator, Page } from '@playwright/test';

export class ProductCard {
  readonly page: Page;
  readonly title: Locator;
  readonly price: Locator;
  readonly image: Locator;
  readonly addToCartButton: Locator;
  readonly learnMoreLink: Locator;

  constructor(page: Page, container: Locator) {
    this.page = page;
    this.title = container.getByRole('heading');
    this.price = container.getByText(/^\$\d+\.\d{2}$/);
    this.image = container.getByRole('img');
    this.addToCartButton = container.getByRole('button', { name: /add to cart/i });
    this.learnMoreLink = container.getByRole('link', { name: /learn more/i });
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async navigateToDetails() {
    await this.learnMoreLink.click();
  }

  async getPrice(): Promise<number> {
    const priceText = await this.price.textContent();
    return parseFloat(priceText?.replace('$', '') || '0');
  }

  async getTitle(): Promise<string | null> {
    return this.title.textContent();
  }
}