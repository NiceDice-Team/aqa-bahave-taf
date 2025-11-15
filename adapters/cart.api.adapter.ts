import { ApiAdapter } from './base.adapter';
import { ENDPOINTS } from '../../constants/endpoints';
import { ICartAdapter, CartItem } from '../interfaces/cart.interface';

export class ApiCartAdapter extends ApiAdapter implements ICartAdapter {
  async addToCart(productId: string, quantity: number): Promise<void> {
    await this.request('POST', ENDPOINTS.CART.ADD, { productId, quantity });
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    await this.request('PUT', ENDPOINTS.CART.UPDATE, { productId, quantity });
  }

  async removeFromCart(productId: string): Promise<void> {
    await this.request('DELETE', `${ENDPOINTS.CART.REMOVE}/${productId}`);
  }

  async viewCart(): Promise<void> {
    await this.request('GET', ENDPOINTS.CART.MAIN);
  }

  async applyPromoCode(code: string): Promise<void> {
    await this.request('POST', ENDPOINTS.PROMO.APPLY, { code });
  }

  async proceedToCheckout(): Promise<void> {
    await this.request('POST', ENDPOINTS.CHECKOUT.MAIN);
  }

  async getSubtotal(): Promise<string> {
    const response = await this.request<{ subtotal: string }>('GET', '/api/cart/subtotal');
    return response.subtotal;
  }

  async isCartEmpty(): Promise<boolean> {
    const items = await this.getCartItems();
    return items.length === 0;
  }

  async getCartItems(): Promise<CartItem[]> {
    const response = await this.request<{ items: CartItem[] }>('GET', '/api/cart/items');
    return response.items;
  }
}