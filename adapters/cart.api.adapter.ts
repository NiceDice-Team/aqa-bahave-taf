import { ApiAdapter } from './base.adapters';
import { ENDPOINTS } from '../constants/endpoints';
import { ICart, CartItem } from '../interfaces/cart.interface';

export class CartApiAdapter extends ApiAdapter implements ICart {
  async addToCart(productId: string, quantity: number): Promise<void> {
    await this.sendRequest('post', ENDPOINTS.CART.ADD, { data: { productId, quantity } });
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    await this.sendRequest('put', ENDPOINTS.CART.UPDATE, { data: { productId, quantity } });
  }

  async removeFromCart(productId: string): Promise<void> {
    await this.sendRequest('delete', `${ENDPOINTS.CART.REMOVE}/${productId}`);
  }

  async viewCart(): Promise<void> {
    await this.sendRequest('get', ENDPOINTS.CART.MAIN);
  }

  async applyPromoCode(code: string): Promise<void> {
    await this.sendRequest('post', ENDPOINTS.PROMO.APPLY, { data: { code } });
  }

  async proceedToCheckout(): Promise<void> {
    await this.sendRequest('post', ENDPOINTS.CHECKOUT.MAIN);
  }

  async getSubtotal(): Promise<string> {
    const response = await this.sendRequest('get', ENDPOINTS.CART.SUBTOTAL) as Response;
    const data = await response.json() as { subtotal: string };
    return data.subtotal;
  }

  async isCartEmpty(): Promise<boolean> {
    const items = await this.getCartItems();
    return items.length === 0;
  }

  async getCartItems(): Promise<CartItem[]> {
    const response = await this.sendRequest('get', ENDPOINTS.CART.ITEMS) as Response;
    const data = await response.json() as { items: CartItem[] };
    return data.items;
  }
}