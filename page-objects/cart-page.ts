import { Page } from '@playwright/test';

export class CartPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async addToCart(productId: string) {
    await this.page.getByTestId(`add-to-cart-${productId}`).click();
  }

  async removeItem(productId: string) {
    const row = this.page.locator('tr', { hasText: productId });
    await row.getByRole('button', { name: /remove/i }).click();
  }

  async isEmpty(): Promise<boolean> {
    return await this.page.getByTestId('empty-cart-message').isVisible();
  }

  async getTotal(): Promise<number> {
    const text = await this.page.getByTestId('total-value').textContent();
    return parseFloat(text || '0');
  }
}