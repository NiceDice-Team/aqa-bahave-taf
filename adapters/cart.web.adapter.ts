import { WebAdapter } from './base.adapter';
import { CartPage } from '../page-objects/cart-page';
import { ENDPOINTS } from '../constants/endpoints';
import { ICartAdapter, CartItem } from '../interfaces/cart.interface';

export class WebCartAdapter extends WebAdapter implements ICartAdapter {
  async addToCart(productId: string, quantity: number): Promise<void> {
    const cartPage = this.getPage(CartPage);
    await cartPage.addToCart(productId, quantity);
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    const cartPage = this.getPage(CartPage);
    await cartPage.updateQuantity(productId, quantity);
  }

  async removeFromCart(productId: string): Promise<void> {
    const cartPage = this.getPage(CartPage);
    await cartPage.removeFromCart(productId);
  }

  async viewCart(): Promise<void> {
    await this.navigateTo(ENDPOINTS.CART.MAIN);
  }

  async applyPromoCode(code: string): Promise<void> {
    const cartPage = this.getPage(CartPage);
    await cartPage.applyPromoCode(code);
  }

  async proceedToCheckout(): Promise<void> {
    const cartPage = this.getPage(CartPage);
    await cartPage.proceedToCheckout();
  }

  async getSubtotal(): Promise<string> {
    const cartPage = this.getPage(CartPage);
    return cartPage.getSubtotal();
  }

  async isCartEmpty(): Promise<boolean> {
    const cartPage = this.getPage(CartPage);
    return cartPage.isEmpty();
  }

  async getCartItems(): Promise<CartItem[]> {
    const cartPage = this.getPage(CartPage);
    return cartPage.getItems();
  }
}