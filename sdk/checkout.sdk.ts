import { ICheckoutSDK } from './interfaces/index';

export class CheckoutSDK implements ICheckoutSDK {
  async initializeCheckout(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async setShippingAddress(address: any): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async setBillingAddress(address: any): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async setShippingMethod(method: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async setPaymentMethod(method: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async validateOrder(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async placeOrder(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async getOrderStatus(orderId: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async getShippingMethods(): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  async getPaymentMethods(): Promise<any[]> {
    throw new Error('Method not implemented.');
  }
}