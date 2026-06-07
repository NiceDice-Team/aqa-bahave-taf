import { ApiAdapter } from './base.adapters';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ICheckout, ShippingDetails, PaymentDetails, OrderStatus } from '../interfaces/checkout.interface';

export class CheckoutApiAdapter extends ApiAdapter implements ICheckout {
  // ── Navigation (no-op for API) ──────────────────────────────────
  async navigateToCheckoutPage(_url: string): Promise<void> {}

  // ── High-level form filling ─────────────────────────────────────────
  async startCheckout(): Promise<void> {
    await this.sendRequest('POST', API_ENDPOINTS.POST_API_ORDERS_START);
  }

  async fillShippingDetails(details: ShippingDetails): Promise<void> {
    // No dedicated shipping endpoint in OpenAPI schema; kept inline until schema is updated
    await this.sendRequest('POST', '/api/checkout/shipping', details);
  }

  async useShippingAsBilling(): Promise<void> {
    // No dedicated billing endpoint in OpenAPI schema; kept inline until schema is updated
    await this.sendRequest('POST', '/api/checkout/use-shipping-as-billing');
  }

  async fillPaymentDetails(details: PaymentDetails): Promise<void> {
    await this.sendRequest('POST', API_ENDPOINTS.POST_API_ORDERS_CREATE_PAYMENT_INTENT, details);
  }

  async placeOrder(): Promise<string> {
    const resp = await this.sendRequest<{ orderId: string }>('POST', API_ENDPOINTS.POST_API_ORDERS);
    return resp.orderId;
  }

  // ── Fine-grained interactions (no-op for API) ─────────────────────
  async selectPaymentMethod(_method: string): Promise<void> {}
  async enterField(_fieldName: string, _value: string): Promise<void> {}
  async leaveFieldEmpty(_fieldName: string): Promise<void> {}
  async leaveCardNumberEmpty(): Promise<void> {}
  async enterCardNumber(_cardNumber: string): Promise<void> {}
  async enterExpiryDate(_date: string): Promise<void> {}
  async enterCVV(_cvv: string): Promise<void> {}
  async completeLiqPayTransaction(): Promise<void> {}
  async enterPromoCode(code: string): Promise<void> {
    // No promo endpoint in OpenAPI schema; kept inline until schema is updated
    await this.sendRequest('POST', '/api/promo/apply', { code });
  }

  // ── Order management ───────────────────────────────────────────────
  async cancelOrder(orderId: string): Promise<void> {
    // No cancel order endpoint in OpenAPI schema; kept inline until schema is updated
    await this.sendRequest('POST', `/api/orders/${orderId}/cancel/`);
  }

  // ── Result queries ──────────────────────────────────────────────────
  async getOrderStatus(orderId: string): Promise<OrderStatus> {
    // No GET order-by-id endpoint in OpenAPI schema; kept inline until schema is updated
    return this.sendRequest<OrderStatus>('GET', `/api/orders/${orderId}/`);
  }

  async getOrders(): Promise<OrderStatus[]> {
    const resp = await this.sendRequest<{ orders: OrderStatus[] }>('GET', API_ENDPOINTS.GET_API_ORDERS);
    return resp.orders ?? [];
  }

  async isOrderConfirmationVisible(): Promise<boolean> {
    return false;
  }

  async getOrderTotalText(): Promise<string> {
    return '';
  }
}
