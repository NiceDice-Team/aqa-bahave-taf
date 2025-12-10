import { WebAdapter } from './base.adapter';
import { CartPage } from '../page-objects/cart-page';
import { ENDPOINTS } from '../constants/endpoints';
import { ICart, CartItem } from '../interfaces/cart.interface';

export class CartWebAdapter extends WebAdapter implements ICart {
  async addToCart(productId: string, quantity: number): Promise<void> {
    // UI implementation or leave empty
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    // UI implementation or leave empty
  }

  async removeFromCart(productId: string): Promise<void> {
    // UI implementation or leave empty
  }

  async viewCart(): Promise<void> {
    // UI implementation or leave empty
  }

  async applyPromoCode(code: string): Promise<void> {
    // UI implementation or leave empty
  }

  async proceedToCheckout(): Promise<void> {
    // UI implementation or leave empty
  }

  async getSubtotal(): Promise<string> {
    // UI implementation or leave empty
    return '';
  }

  async isCartEmpty(): Promise<boolean> {
    // UI implementation or leave empty
    return false;
  }

  async getCartItems(): Promise<CartItem[]> {
    // UI implementation or leave empty
    return [];
  }
}
