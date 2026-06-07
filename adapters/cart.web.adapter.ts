import { WebAdapter } from './base.adapters';
import { CartPage } from '../page-objects/cart-page';
import { CatalogPage } from '../page-objects/catalog-page';
import { ENDPOINTS } from '../constants/endpoints';
import { ICart, CartItem } from '../interfaces/cart.interface';

export class CartWebAdapter extends WebAdapter implements ICart {
  private getCartPage(): CartPage {
    return new CartPage(this.page);
  }

  private getCatalogPage(): CatalogPage {
    return this.getPage(CatalogPage);
  }

  // ── Navigation ───────────────────────────────────────────────────────

  async navigateToCart(): Promise<void> {
    await this.getCartPage().navigate();
  }

  async navigateToProductByName(productName: string): Promise<void> {
    await this.getCatalogPage().navigateToProductByName(productName);
  }

  // ── High-level actions ──────────────────────────────────────────────

  async addToCart(productId: string, quantity: number): Promise<void> {
    await this.navigateTo(ENDPOINTS.PRODUCTS.DETAILS(productId));
    await this.page.waitForLoadState('networkidle');
    const cp = this.getCartPage();
    if (quantity > 1) await cp.setQuantity(quantity.toString());
    await this.clickAddToCart();
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    await this.navigateToCart();
    await this.getCartPage().setQuantity(quantity.toString());
  }

  async removeFromCart(productId: string): Promise<void> {
    await this.navigateToCart();
    await this.getCartPage().clickRemoveByName(productId);
  }

  async viewCart(): Promise<void> {
    await this.navigateToCart();
  }

  async applyPromoCode(code: string): Promise<void> {
    await this.navigateTo(ENDPOINTS.CART.MAIN);
    await this.page.locator('input[name="promoCode"], input[name="promo_code"], #promoCode').fill(code);
    await this.page.getByRole('button', { name: /apply/i }).click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.navigateTo(ENDPOINTS.CART.MAIN);
    await this.page.getByRole('button', { name: /checkout/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  // ── Fine-grained UI actions ──────────────────────────────────────────

  async addFirstProductToCart(): Promise<string> {
    const name = await this.getCatalogPage().clickFirstProduct();
    await this.page.getByRole('button', { name: /add to cart/i }).click();
    return name;
  }

  async clickAddToCart(): Promise<void> {
    await this.page.getByRole('button', { name: /add to cart/i }).click();
  }

  async setQuantity(quantity: string): Promise<void> {
    await this.getCartPage().setQuantity(quantity);
  }

  async clickRemove(productName: string): Promise<void> {
    await this.getCartPage().clickRemoveByName(productName);
  }

  // ── Queries ────────────────────────────────────────────────────────────

  async getSubtotal(): Promise<string> {
    return this.getCartPage().getSubtotalText();
  }

  async getSubtotalValue(): Promise<number> {
    return this.getCartPage().getSubtotalValue();
  }

  async getItemQuantity(productName: string): Promise<number> {
    return this.getCartPage().getItemQuantity(productName);
  }

  async getItemLineTotal(productName: string): Promise<number> {
    return this.getCartPage().getItemLineTotal(productName);
  }

  async isProductInCart(productName: string): Promise<boolean> {
    return this.getCartPage().isProductInCart(productName);
  }

  async isCartEmpty(): Promise<boolean> {
    return this.getCartPage().isEmpty();
  }

  async getCartItems(): Promise<CartItem[]> {
    // Not implemented for web — items must be read via individual product checks
    return [];
  }
}
