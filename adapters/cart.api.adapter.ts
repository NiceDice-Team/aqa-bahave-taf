import { ApiAdapter } from './base.adapters';
import { ENDPOINTS } from '../constants/endpoints';
import { ICart, CartItem } from '../interfaces/cart.interface';

export class CartApiAdapter extends ApiAdapter implements ICart {
  async addToCart(productId: string, quantity: number): Promise<void> {
    await this.request.post(ENDPOINTS.CART.ADD, { data: { productId, quantity } });
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    await this.request.put(ENDPOINTS.CART.UPDATE, { data: { productId, quantity } });
  }

  async removeFromCart(productId: string): Promise<void> {
    await this.request.delete(`${ENDPOINTS.CART.REMOVE}/${productId}`);
  }

  async viewCart(): Promise<void> {
    await this.request.get(ENDPOINTS.CART.MAIN);
  }

  async applyPromoCode(code: string): Promise<void> {
    await this.request.post(ENDPOINTS.PROMO.APPLY, { data: { code } });
  }

  async proceedToCheckout(): Promise<void> {
    await this.request.post(ENDPOINTS.CHECKOUT.MAIN);
  }

  async getSubtotal(): Promise<string> {
    const response = await this.request.get('/api/cart/subtotal');
    const data = await response.json();
    return data.subtotal;
  }

  async isCartEmpty(): Promise<boolean> {
    const items = await this.getCartItems();
    return items.length === 0;
  }

  async getCartItems(): Promise<CartItem[]> {
    const response = await this.request.get('/api/cart/items');
    const data = await response.json();
    return data.items;
  }
}