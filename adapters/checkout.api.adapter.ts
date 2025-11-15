import { ApiAdapter } from './base.adapter';
import { ENDPOINTS } from '../../constants/endpoints';
import { 
  ICheckoutAdapter,
  ShippingDetails,
  PaymentDetails,
  OrderStatus
} from '../interfaces/checkout.interface';

export class ApiCheckoutAdapter extends ApiAdapter implements ICheckoutAdapter {
  async startCheckout(): Promise<void> {
    await this.request('POST', ENDPOINTS.CHECKOUT.MAIN);
  }

  async fillShippingDetails(details: ShippingDetails): Promise<void> {
    await this.request('POST', '/api/checkout/shipping', details);
  }

  async useShippingAsBilling(): Promise<void> {
    await this.request('POST', '/api/checkout/use-shipping-as-billing');
  }

  async fillPaymentDetails(details: PaymentDetails): Promise<void> {
    await this.request('POST', '/api/checkout/payment', details);
  }

  async placeOrder(): Promise<string> {
    const response = await this.request<{ orderId: string }>('POST', ENDPOINTS.CHECKOUT.PLACE_ORDER);
    return response.orderId;
  }

  async getOrderStatus(orderId: string): Promise<OrderStatus> {
    const response = await this.request<OrderStatus>('GET', ENDPOINTS.ORDERS.DETAILS(orderId));
    return response;
  }

  async cancelOrder(orderId: string): Promise<void> {
    await this.request('POST', ENDPOINTS.ORDERS.CANCEL(orderId));
  }

  async getOrders(): Promise<OrderStatus[]> {
    const response = await this.request<{ orders: OrderStatus[] }>('GET', ENDPOINTS.ORDERS.LIST);
    return response.orders;
  }
}