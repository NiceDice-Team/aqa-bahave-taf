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
    // Avoid text=/.../ which is not valid CSS; use getByText() or has-text locator instead
    this.emptyCartMessage = page.locator(
      '[data-testid="empty-cart-message"], .empty-cart, :has-text("Your cart is empty")'
    );
    this.subtotalEl = page
      .locator('[data-testid="cart-subtotal"], [data-testid="subtotal"], .cart-subtotal, .subtotal')
      .first();
    this.totalEl = page.getByTestId('total-value');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/cart');
    await this.page.waitForLoadState('load');
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

    // Try to find remove button within the row
    const removeBtn = row.getByRole('button', { name: /remove|delete|×|x/i }).first();

    try {
      await removeBtn.waitFor({ state: 'visible', timeout: 5000 });
      await removeBtn.click();
    } catch {
      // Fallback: try link or any clickable element with remove text
      try {
        const removeLinkOrBtn = row
          .locator('a:has-text("remove"), button:has-text("remove"), [class*="remove"]')
          .first();
        await removeLinkOrBtn.waitFor({ state: 'visible', timeout: 5000 });
        await removeLinkOrBtn.click();
      } catch {
        // Last fallback: log and throw
        throw new Error(`Remove button for "${productName}" not found in cart row.`);
      }
    }

    await this.page.waitForLoadState('load');
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
    const input = row.locator('input[type="number"], [data-testid="quantity"], .quantity').first();

    try {
      await input.waitFor({ state: 'attached', timeout: 5000 });
      const val = await input.inputValue().catch(() => null);
      if (val) return parseInt(val, 10);
    } catch {
      // Fallback: try to read visible text if input not found
    }

    // Fallback: try text content of quantity element
    const qtyEl = row.locator('[class*="quantity"], [data-testid*="quantity"], span:has-text(/^\\d+$/)').first();
    const text = await qtyEl.textContent().catch(() => '1');
    const parsed = parseInt(text ?? '1', 10);
    return isNaN(parsed) ? 1 : parsed;
  }

  /** Whether a product (by name) is currently visible in the cart */
  async isProductInCart(productName: string): Promise<boolean> {
    try {
      await this.page.waitForLoadState('load', { timeout: 5000 }).catch(() => {});

      // Try exact match first
      const exactMatch = await this.page
        .getByText(productName, { exact: true })
        .first()
        .isVisible()
        .catch(() => false);

      if (exactMatch) return true;

      // Fallback: try partial/regex match with first word
      const firstWord = productName.split(/[\s,]/)[0];
      if (firstWord && firstWord.length > 2) {
        const partialMatch = await this.page
          .locator(`text=/${firstWord}/i`)
          .first()
          .isVisible()
          .catch(() => false);
        return partialMatch;
      }

      return false;
    } catch {
      return false;
    }
  }

  /** Whether the cart is empty */
  async isEmpty(): Promise<boolean> {
    try {
      return await this.emptyCartMessage.first().isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
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
    // Escape quotes for proper selector syntax
    const escaped = productName.replace(/"/g, '\\"');

    // Try multiple selector strategies to find cart item by product name:
    // 1. data-testid attribute with product name
    // 2. Generic cart-item class
    // 3. Table row
    // 4. Fallback: any element containing the product name
    const selector =
      `[data-testid="cart-item"]:has-text("${escaped}"),` +
      `.cart-item:has-text("${escaped}"),` +
      `tr:has-text("${escaped}"),` +
      `[class*="item"]:has-text("${escaped}"),` +
      `li:has-text("${escaped}")`;

    return this.page.locator(selector).first();
  }
}
