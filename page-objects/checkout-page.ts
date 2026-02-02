//Checkout page object implementagtion
import { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly totalAmount: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.totalAmount = page.getByTestId('total-amount');
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async getTotalAmount(): Promise<string | null> {
    return this.totalAmount.textContent();
  }
}   
