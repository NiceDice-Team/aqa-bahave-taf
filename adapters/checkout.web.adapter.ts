import { WebAdapter } from './base.adapters';
import { ICheckout, ShippingDetails, PaymentDetails, OrderStatus } from '../interfaces/checkout.interface';

export class CheckoutWebAdapter extends WebAdapter implements ICheckout {
  async startCheckout(): Promise<void> {
    // UI implementation or leave empty
  }

  async fillShippingDetails(details: ShippingDetails): Promise<void> {
    // UI implementation or leave empty
  }

  async useShippingAsBilling(): Promise<void> {
    // UI implementation or leave empty
  }

  async fillPaymentDetails(details: PaymentDetails): Promise<void> {
    // UI implementation or leave empty
  }

  async placeOrder(): Promise<string> {
    // UI implementation or leave empty
    return '';
  }

  async getOrderStatus(orderId: string): Promise<OrderStatus> {
    // UI implementation or leave empty
    return {
      orderId: '',
      status: 'new',
      total: 0,
    };
  }

  async cancelOrder(orderId: string): Promise<void> {
    // UI implementation or leave empty
  }

  async getOrders(): Promise<OrderStatus[]> {
    // UI implementation or leave empty
    return [];
  }
}
