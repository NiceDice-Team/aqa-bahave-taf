import { ICartSDK } from './interfaces/index';

export class CartSDK implements ICartSDK {
  async addToCart(productId: string, quantity: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async removeFromCart(productId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getCart(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async clearCart(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async applyPromoCode(code: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async removePromoCode(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getTotal(): Promise<number> {
    throw new Error('Method not implemented.');
  }

  async getSubtotal(): Promise<number> {
    throw new Error('Method not implemented.');
  }

  async getTaxes(): Promise<number> {
    throw new Error('Method not implemented.');
  }
}