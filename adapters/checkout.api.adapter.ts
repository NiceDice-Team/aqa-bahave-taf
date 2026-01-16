import { ApiAdapter } from './base.adapters';
import { ENDPOINTS } from '../constants/endpoints';
import { 
  ICheckout,
  ShippingDetails,
  PaymentDetails,
  OrderStatus
} from '../interfaces/checkout.interface';

export class CheckoutApiAdapter extends ApiAdapter implements ICheckout {

  async startCheckout(): Promise<void> {
    await this.sendRequest('POST', ENDPOINTS.CHECKOUT.MAIN, undefined);
  }

  async fillShippingDetails(details: ShippingDetails): Promise<void> {
    await this.sendRequest('POST', '/api/checkout/shipping', details);
  }

  async useShippingAsBilling(): Promise<void> {
    await this.sendRequest('POST', '/api/checkout/use-shipping-as-billing', undefined);
  }

  async fillPaymentDetails(details: PaymentDetails): Promise<void> {
    await this.sendRequest('POST', '/api/checkout/payment', details);
  }

  async placeOrder(): Promise<string> {
    const response = await this.sendRequest<{ orderId: string }>('POST', ENDPOINTS.CHECKOUT.PLACE_ORDER, undefined);
    return response.orderId;
  }

  async getOrderStatus(orderId: string): Promise<OrderStatus> {
    const response = await this.sendRequest<OrderStatus>('GET', ENDPOINTS.ORDERS.DETAILS(orderId), undefined);
    return {
      ...response
    } as OrderStatus;
  }

  async cancelOrder(orderId: string): Promise<void> {
    await this.sendRequest('POST', ENDPOINTS.ORDERS.CANCEL(orderId), undefined);
  }

  async getOrders(): Promise<OrderStatus[]> {
    const response = await this.sendRequest<{ orders: OrderStatus[] }>('GET', ENDPOINTS.ORDERS.LIST, undefined);
    return response.orders;
  }
}