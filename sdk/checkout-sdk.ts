import { ICheckout, ShippingDetails, OrderStatus, PaymentDetails} from '../interfaces';
import {CheckoutApiAdapter, CheckoutWebAdapter} from '../adapters'

export class CheckoutSDK implements ICheckout {
  private adapter: CheckoutApiAdapter | CheckoutWebAdapter;

  constructor(adapter: CheckoutApiAdapter | CheckoutWebAdapter) {
    this.adapter = adapter;
  }

  async startCheckout(): Promise<void> {
    await this.adapter.startCheckout();
  }

  async fillShippingDetails(details: ShippingDetails): Promise<void> {
    await this.adapter.fillShippingDetails(details);
  }

  async useShippingAsBilling(): Promise<void> {
    await this.adapter.useShippingAsBilling();
  }

  async fillPaymentDetails(details: PaymentDetails): Promise<void> {
    await this.adapter.fillPaymentDetails(details);
  }

  async placeOrder(): Promise<string> {
    return this.adapter.placeOrder();
  }

  async getOrderStatus(orderId: string): Promise<OrderStatus> {
    return this.adapter.getOrderStatus(orderId);
  }

  async cancelOrder(orderId: string): Promise<void> {
    await this.adapter.cancelOrder(orderId);
  }

  async getOrders(): Promise<OrderStatus[]> {
    return this.adapter.getOrders();
  }
}