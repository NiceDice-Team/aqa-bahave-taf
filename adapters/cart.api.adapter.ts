import { ApiAdapter } from './base.adapters';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ICart, CartItem } from '../interfaces/cart.interface';

export class CartApiAdapter extends ApiAdapter implements ICart {
  // ── Navigation (no-op for API) ────────────────────────────────────
  async navigateToCart(): Promise<void> {}
  async navigateToProductByName(_name: string): Promise<void> {}

  // ── High-level actions ────────────────────────────────────────────
  async addToCart(productId: string, quantity: number): Promise<void> {
    await this.sendRequest('POST', API_ENDPOINTS.POST_API_CART_ITEM, { productId, quantity });
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    await this.sendRequest('PATCH', API_ENDPOINTS.PATCH_API_CART_ITEM, { productId, quantity });
  }

  async removeFromCart(productId: string): Promise<void> {
    await this.sendRequest('DELETE', API_ENDPOINTS.DELETE_API_CART_ITEM, { productId });
  }

  async viewCart(): Promise<void> {
    await this.sendRequest('GET', API_ENDPOINTS.GET_API_CART);
  }

  async applyPromoCode(code: string): Promise<void> {
    // No promo endpoint in OpenAPI schema; kept as inline until schema is updated
    await this.sendRequest('POST', '/api/promo/apply', { code });
  }

  async proceedToCheckout(): Promise<void> {
    await this.sendRequest('POST', API_ENDPOINTS.POST_API_ORDERS_START);
  }

  // ── Fine-grained UI actions (no-op for API) ──────────────────────
  async addFirstProductToCart(): Promise<string> {
    const resp = await this.sendRequest<{ items: Array<{ id: string }> }>('GET', API_ENDPOINTS.GET_API_CART);
    const firstId = resp.items?.[0]?.id ?? 'product-1';
    await this.addToCart(firstId, 1);
    return firstId;
  }

  async clickAddToCart(): Promise<void> {}
  async setQuantity(_quantity: string): Promise<void> {}
  async clickRemove(_productName: string): Promise<void> {}

  // ── Queries ──────────────────────────────────────────────────────
  async getSubtotal(): Promise<string> {
    const resp = await this.sendRequest<{ subtotal: string }>('GET', API_ENDPOINTS.GET_API_CART);
    return resp.subtotal;
  }

  async getSubtotalValue(): Promise<number> {
    const text = await this.getSubtotal();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getItemQuantity(_productName: string): Promise<number> {
    return 0;
  }

  async getItemLineTotal(_productName: string): Promise<number> {
    return 0;
  }

  async isProductInCart(productName: string): Promise<boolean> {
    const items = await this.getCartItems();
    return items.some((i) => i.productId === productName);
  }

  async isCartEmpty(): Promise<boolean> {
    const items = await this.getCartItems();
    return items.length === 0;
  }

  async getCartItems(): Promise<CartItem[]> {
    const resp = await this.sendRequest<{ items: CartItem[] }>('GET', API_ENDPOINTS.GET_API_CART);
    return resp.items ?? [];
  }
}
