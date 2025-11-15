import { Page } from '@playwright/test';
import { BaseSDK } from './base-sdk';
import { 
  WebCheckoutAdapter, 
  ShippingDetails, 
  PaymentDetails, 
  OrderStatus 
} from '../adapters/WebCheckoutAdapter';

export class CheckoutSDK extends BaseSDK {
  private webAdapter: WebCheckoutAdapter;

  constructor(page: Page) {
    super(page);
    this.webAdapter = new WebCheckoutAdapter(this.page);
  }

  async startCheckout(): Promise<void> {
    await this.webAdapter.startCheckout();
  }

  async fillShippingDetails(details: ShippingDetails): Promise<void> {
    await this.webAdapter.fillShippingDetails(details);
  }

  async useShippingAsBilling(): Promise<void> {
    await this.webAdapter.useShippingAsBilling();
  }

  async fillPaymentDetails(details: PaymentDetails): Promise<void> {
    await this.webAdapter.fillPaymentDetails(details);
  }

  async placeOrder(): Promise<string> {
    return this.webAdapter.placeOrder();
  }

  async getOrderStatus(orderId: string): Promise<OrderStatus> {
    return this.webAdapter.getOrderStatus(orderId);
  }

  async cancelOrder(orderId: string): Promise<void> {
    await this.webAdapter.cancelOrder(orderId);
  }
}