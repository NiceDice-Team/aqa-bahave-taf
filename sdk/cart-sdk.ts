import { Page } from '@playwright/test';
import { BaseSDK } from './base-sdk';
import { WebCartAdapter, CartItem } from '../adapters/WebCartAdapter';

export class CartSDK extends BaseSDK {
  private webAdapter: WebCartAdapter;

  constructor(page: Page) {
    super(page);
    this.webAdapter = new WebCartAdapter(this.page);
  }

  async addToCart(productId: string, quantity: number): Promise<void> {
    await this.webAdapter.addToCart(productId, quantity);
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    await this.webAdapter.updateQuantity(productId, quantity);
  }

  async removeFromCart(productId: string): Promise<void> {
    await this.webAdapter.removeFromCart(productId);
  }

  async viewCart(): Promise<void> {
    await this.webAdapter.viewCart();
  }

  async applyPromoCode(code: string): Promise<void> {
    await this.webAdapter.applyPromoCode(code);
  }

  async proceedToCheckout(): Promise<void> {
    await this.webAdapter.proceedToCheckout();
  }

  async getSubtotal(): Promise<string> {
    return this.webAdapter.getSubtotal();
  }

  async isCartEmpty(): Promise<boolean> {
    return this.webAdapter.isCartEmpty();
  }

  async getCartItems(): Promise<CartItem[]> {
    return this.webAdapter.getCartItems();
  }
}