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
    await this.request.post(ENDPOINTS.CHECKOUT.MAIN);
  }

  async fillShippingDetails(details: ShippingDetails): Promise<void> {
    await this.request.post('/api/checkout/shipping', { data: details });
  }

  async useShippingAsBilling(): Promise<void> {
    await this.request.post('/api/checkout/use-shipping-as-billing');
  }

  async fillPaymentDetails(details: PaymentDetails): Promise<void> {
    await this.request.post('/api/checkout/payment', { data: details });
  }

  async placeOrder(): Promise<string> {
    const apiResponse = await this.request.post(ENDPOINTS.CHECKOUT.PLACE_ORDER);
    const response = await apiResponse.json(); // Adjust if your HTTP client uses a different method
    // Adjust according to actual API response structure
    return response.orderId;
  }

  async getOrderStatus(orderId: string): Promise<OrderStatus> {
    const apiResponse = await this.request.get(ENDPOINTS.ORDERS.DETAILS(orderId));
    const response = await apiResponse.json(); // or .body(), depending on your HTTP client
    // Map the response to OrderStatus, adjust property names if needed
    return {
      orderId: response.orderId,
      total: response.total,
      status: response.status,
      ...response
    } as OrderStatus;
  }

  async cancelOrder(orderId: string): Promise<void> {
    await this.request.post(ENDPOINTS.ORDERS.CANCEL(orderId));
  }

  async getOrders(): Promise<OrderStatus[]> {
    const apiResponse = await this.request.get(ENDPOINTS.ORDERS.LIST);
    const response = await apiResponse.json(); // Adjust if your HTTP client uses a different method
    return response.orders;
  }
}