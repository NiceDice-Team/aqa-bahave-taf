import { ApiAdapter } from './base.adapters';
import { ENDPOINTS } from '../constants/endpoints';
import { ICheckout, ShippingDetails, PaymentDetails, OrderStatus } from '../interfaces/checkout.interface';

export class CheckoutApiAdapter extends ApiAdapter implements ICheckout {
  // ── Navigation (no-op for API) ──────────────────────────────────
  async navigateToCheckoutPage(_url: string): Promise<void> {}

  // ── High-level form filling ─────────────────────────────────────────
  async startCheckout(): Promise<void> {
    await this.sendRequest('POST', ENDPOINTS.CHECKOUT.MAIN);
  }

  async fillShippingDetails(details: ShippingDetails): Promise<void> {
    await this.sendRequest('POST', '/api/checkout/shipping', details);
  }

  async useShippingAsBilling(): Promise<void> {
    await this.sendRequest('POST', '/api/checkout/use-shipping-as-billing');
  }

  async fillPaymentDetails(details: PaymentDetails): Promise<void> {
    await this.sendRequest('POST', '/api/checkout/payment', details);
  }

  async placeOrder(): Promise<string> {
    const resp = await this.sendRequest<{ orderId: string }>('POST', ENDPOINTS.CHECKOUT.PLACE_ORDER);
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
    await this.sendRequest('POST', ENDPOINTS.PROMO.APPLY, { code });
  }

  // ── Order management ───────────────────────────────────────────────
  async cancelOrder(orderId: string): Promise<void> {
    await this.sendRequest('POST', ENDPOINTS.ORDERS.CANCEL(orderId));
  }

  // ── Result queries ──────────────────────────────────────────────────
  async getOrderStatus(orderId: string): Promise<OrderStatus> {
    return this.sendRequest<OrderStatus>('GET', ENDPOINTS.ORDERS.DETAILS(orderId));
  }

  async getOrders(): Promise<OrderStatus[]> {
    const resp = await this.sendRequest<{ orders: OrderStatus[] }>('GET', ENDPOINTS.ORDERS.LIST);
    return resp.orders ?? [];
  }

  async isOrderConfirmationVisible(): Promise<boolean> {
    return false;
  }

  async getOrderTotalText(): Promise<string> {
    return '';
  }
}
