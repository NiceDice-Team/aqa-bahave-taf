import { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly placeOrderButton: Locator;
  readonly cancelOrderButton: Locator;
  readonly totalAmount: Locator;
  readonly orderConfirmation: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByRole('button', { name: /^checkout$/i });
    this.placeOrderButton = page.getByRole('button', { name: /place order/i });
    this.cancelOrderButton = page.getByRole('button', { name: /cancel order/i });
    this.totalAmount = page.getByTestId('total-amount');
    this.orderConfirmation = page.locator(
      '[data-testid="order-confirmation"], .order-confirmation, h1:has-text("Order Confirmed")'
    );
    this.errorMessage = page.locator('[role="alert"], .error-message, .alert-danger, .error').first();
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }

  async cancelOrder(): Promise<void> {
    await this.cancelOrderButton.click();
  }

  async fillShippingDetails(details: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    zipCode?: string;
  }): Promise<void> {
    const f = async (selectors: string[], value: string) => {
      const loc = this.page.locator(selectors.join(', ')).first();
      if ((await loc.count()) > 0) await loc.fill(value);
    };
    if (details.firstName)
      await f(['input[name="firstName"]', '#firstName', 'input[name="first_name"]'], details.firstName);
    if (details.lastName) await f(['input[name="lastName"]', '#lastName', 'input[name="last_name"]'], details.lastName);
    if (details.address) await f(['input[name="address"]', '#address', 'input[name="street"]'], details.address);
    if (details.city) await f(['input[name="city"]', '#city'], details.city);
    if (details.zipCode) await f(['input[name="zipCode"]', '#zipCode', 'input[name="zip"]'], details.zipCode);
    if (details.phone) await f(['input[name="phone"]', 'input[type="tel"]'], details.phone);
    if (details.email) await f(['input[name="email"]', '#email'], details.email);
  }

  async fillBillingDetails(details: { address?: string; city?: string; zip?: string }): Promise<void> {
    const f = async (selectors: string[], value: string) => {
      const loc = this.page.locator(selectors.join(', ')).first();
      if ((await loc.count()) > 0) await loc.fill(value);
    };
    if (details.address) await f(['input[name="billingAddress"]', '#billingAddress'], details.address);
    if (details.city) await f(['input[name="billingCity"]', '#billingCity'], details.city);
    if (details.zip) await f(['input[name="billingZip"]', '#billingZip'], details.zip);
  }

  async checkUseShippingAsBilling(): Promise<void> {
    const cb = this.page
      .locator('input[type="checkbox"]:near(:text("shipping as billing")), label:has-text("shipping") input')
      .first();
    if ((await cb.count()) > 0) await cb.check();
  }

  async selectPaymentMethod(method: string): Promise<void> {
    const select = this.page.locator('select[name="paymentMethod"], [name="payment_method"]').first();
    if ((await select.count()) > 0) {
      await select.selectOption(method);
    } else {
      await this.page.locator(`input[value="${method}"], label:has-text("${method}")`).first().click();
    }
  }

  async fillCardDetails(details: { cardNumber?: string; expiry?: string; cvv?: string; name?: string }): Promise<void> {
    if (details.cardNumber) await this.page.locator('input[name="cardNumber"], #cardNumber').fill(details.cardNumber);
    if (details.expiry)
      await this.page.locator('input[name="cardExpiry"], input[name="expiry"], #cardExpiry').fill(details.expiry);
    if (details.cvv) await this.page.locator('input[name="cardCvv"], input[name="cvv"], #cardCvv').fill(details.cvv);
    if (details.name) await this.page.locator('input[name="cardName"], #cardName').fill(details.name);
  }

  /** Enter any named form field by a human-readable field name */
  async enterField(fieldName: string, value: string): Promise<void> {
    const fieldMap: Record<string, string> = {
      email: 'input[name="email"], #email',
      phone: 'input[name="phone"], input[type="tel"]',
      'zip code': 'input[name="zipCode"], input[name="zip"], #zipCode',
      zipcode: 'input[name="zipCode"], input[name="zip"], #zipCode',
      address: 'input[name="address"], input[name="street"], #address',
      city: 'input[name="city"], #city',
    };
    const key = fieldName.toLowerCase();
    const selector = fieldMap[key] ?? `input[name="${fieldName}"], #${fieldName}`;
    await this.page.locator(selector).first().fill(value);
  }

  async enterCardNumber(cardNumber: string): Promise<void> {
    await this.page.locator('input[name="cardNumber"], #cardNumber').fill(cardNumber);
  }

  async enterExpiryDate(date: string): Promise<void> {
    await this.page.locator('input[name="cardExpiry"], input[name="expiry"], #cardExpiry').fill(date);
  }

  async enterCVV(cvv: string): Promise<void> {
    await this.page.locator('input[name="cardCvv"], input[name="cvv"], #cardCvv').fill(cvv);
  }

  async enterPromoCode(code: string): Promise<void> {
    await this.page.locator('input[name="promoCode"], input[name="promo_code"], #promoCode').fill(code);
  }

  async completeLiqPayTransaction(): Promise<void> {
    const btn = this.page
      .locator('button:has-text("LiqPay"), button:has-text("Pay with LiqPay"), [data-payment="liqpay"]')
      .first();
    if ((await btn.count()) > 0) await btn.click();
    await this.page.waitForURL(/\/order|confirmation|success/, { timeout: 10000 }).catch(() => {});
  }

  async isOrderConfirmationVisible(): Promise<boolean> {
    return this.orderConfirmation.isVisible({ timeout: 10000 });
  }

  async getTotalAmount(): Promise<string | null> {
    return this.totalAmount.textContent();
  }
}
