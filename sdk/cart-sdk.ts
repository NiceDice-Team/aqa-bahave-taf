import { ICart, CartItem } from '../interfaces/cart.interface';
import { CartApiAdapter, CartWebAdapter } from '../adapters';

export class CartSDK implements ICart {
  private adapter: CartApiAdapter | CartWebAdapter;

  constructor(adapter: CartApiAdapter | CartWebAdapter) {
    this.adapter = adapter;
  }

  async addToCart(productId: string, quantity: number): Promise<void> {
    await this.adapter.addToCart(productId, quantity);
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    await this.adapter.updateQuantity(productId, quantity);
  }

  async removeFromCart(productId: string): Promise<void> {
    await this.adapter.removeFromCart(productId);
  }

  async viewCart(): Promise<void> {
    await this.adapter.viewCart();
  }

  async applyPromoCode(code: string): Promise<void> {
    await this.adapter.applyPromoCode(code);
  }

  async proceedToCheckout(): Promise<void> {
    await this.adapter.proceedToCheckout();
  }

  async getSubtotal(): Promise<string> {
    return this.adapter.getSubtotal();
  }

  async isCartEmpty(): Promise<boolean> {
    return this.adapter.isCartEmpty();
  }

  async getCartItems(): Promise<CartItem[]> {
    return this.adapter.getCartItems();
  }
}