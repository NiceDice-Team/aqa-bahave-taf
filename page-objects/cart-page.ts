import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class CartPage extends BasePage {
  readonly cartHeading: Locator;
  readonly cartTable: Locator;
  readonly subtotalText: Locator;
  readonly shippingText: Locator;
  readonly totalText: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingLink: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    // prefer stable test ids when available
    this.cartHeading = page.getByTestId('cart-heading');
    this.cartTable = page.getByTestId('cart-table');
    // Use explicit value elements only (avoid matching label text)
    this.subtotalText = page.getByTestId('subtotal-value');
    this.shippingText = page.getByTestId('shipping-value');
    this.totalText = page.getByTestId('total-value');
    this.checkoutButton = page.getByTestId('checkout-button');
    this.continueShoppingLink = page.getByTestId('continue-shopping');
    this.emptyCartMessage = page.getByTestId('empty-cart-message');
  }

  async removeItem(itemName: string) {
    const row = this.cartTable.locator('tr', { hasText: itemName });
    await row.getByRole('button', { name: /remove/i }).click();
  }

  async updateQuantity(itemName: string, quantity: number) {
    const row = this.cartTable.locator('tr', { hasText: itemName });
    await row.getByRole('spinbutton', { name: /quantity/i }).fill(quantity.toString());
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingLink.click();
  }

  async getSubtotal(): Promise<number> {
    const text = await this.subtotalText.textContent();
    return this.extractPrice(text || '');
  }

  async getTotal(): Promise<number> {
    const text = await this.totalText.textContent();
    return this.extractPrice(text || '');
  }

  private extractPrice(text: string): number {
    const match = text.match(/\$(\d+\.\d{2})/);
    return match ? parseFloat(match[1]) : 0;
  }
}