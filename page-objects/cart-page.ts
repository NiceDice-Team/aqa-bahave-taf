import { Page, Locator } from '@playwright/test';

export class CartPage {
  private page: Page;
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly subtotalEl: Locator;
  readonly totalEl: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('div[class*="pb-6"]').filter({ has: page.locator('img') });
    this.emptyCartMessage = page.locator('[data-testid="empty-cart-message"], text=/your cart is empty/i, .empty-cart');
    this.subtotalEl = page
      .locator('[data-testid="cart-subtotal"], [data-testid="subtotal"], .cart-subtotal, .subtotal')
      .first();
    this.totalEl = page.getByTestId('total-value');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/cart');
    await this.page.waitForLoadState('networkidle');
  }

  /** Add product by its data-testid id */
  async addToCart(productId: string): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${productId}`).click();
  }

  /** Click the remove button next to a product identified by productId text */
  async removeItem(productId: string): Promise<void> {
    const row = this.page.locator('tr', { hasText: productId });
    await row.getByRole('button', { name: /remove/i }).click();
  }

  /** Click the remove button for a product identified by visible name */
  async clickRemoveByName(productName: string): Promise<void> {
    const row = this.itemRowByName(productName);
    await row
      .getByRole('button', { name: /remove|delete/i })
      .first()
      .click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Set quantity on the quantity input that is currently visible (product page or cart) */
  async setQuantity(quantity: string): Promise<void> {
    const input = this.page
      .locator('[data-testid="quantity-input"], input[name="quantity"], input[type="number"]')
      .first();
    await input.fill(quantity);
    await input.press('Tab');
  }

  /** Get the quantity for a specific cart item by product name */
  async getItemQuantity(productName: string): Promise<number> {
    const row = this.itemRowByName(productName);
    const input = row.locator('input[type="number"], [data-testid="quantity"]').first();
    const val = await input.inputValue();
    return parseInt(val, 10);
  }

  /** Whether a product (by name) is currently visible in the cart */
  async isProductInCart(productName: string): Promise<boolean> {
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
      return await this.page
        .getByText(productName, { exact: true })
        .first()
        .isVisible()
        .catch(() => false);
    } catch {
      return false;
    }
  }

  /** Whether the cart is empty */
  async isEmpty(): Promise<boolean> {
    return this.emptyCartMessage.first().isVisible();
  }

  /** Numeric subtotal value */
  async getSubtotalValue(): Promise<number> {
    const text = await this.subtotalEl.textContent();
    return parseFloat(text?.replace(/[^0-9.]/g, '') ?? '0');
  }

  /** Subtotal as raw text string */
  async getSubtotalText(): Promise<string> {
    return (await this.subtotalEl.textContent()) ?? '0';
  }

  /** Line total for a specific cart item */
  async getItemLineTotal(productName: string): Promise<number> {
    const row = this.itemRowByName(productName);
    const el = row.locator('[data-testid="item-total"], .item-total, .line-total, td:last-child').first();
    const text = await el.textContent();
    return parseFloat(text?.replace(/[^0-9.]/g, '') ?? '0');
  }

  /** Cart grand total */
  async getTotal(): Promise<number> {
    const text = await this.totalEl.textContent();
    return parseFloat(text || '0');
  }

  private itemRowByName(productName: string): Locator {
    return this.page
      .locator(
        `[data-testid="cart-item"]:has-text("${productName}"),` +
          `.cart-item:has-text("${productName}"),` +
          `tr:has-text("${productName}")`
      )
      .first();
  }
}
