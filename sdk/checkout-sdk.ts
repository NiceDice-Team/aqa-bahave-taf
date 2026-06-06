import { ICheckout, ShippingDetails, OrderStatus, PaymentDetails } from '../interfaces';

export class CheckoutSDK implements ICheckout {
  constructor(private adapter: ICheckout) {}

  // Navigation
  navigateToCheckoutPage(url: string) {
    return this.adapter.navigateToCheckoutPage(url);
  }

  // High-level form filling
  startCheckout() {
    return this.adapter.startCheckout();
  }
  fillShippingDetails(d: ShippingDetails) {
    return this.adapter.fillShippingDetails(d);
  }
  useShippingAsBilling() {
    return this.adapter.useShippingAsBilling();
  }
  fillPaymentDetails(d: PaymentDetails) {
    return this.adapter.fillPaymentDetails(d);
  }
  placeOrder() {
    return this.adapter.placeOrder();
  }

  // Fine-grained interactions
  selectPaymentMethod(method: string) {
    return this.adapter.selectPaymentMethod(method);
  }
  enterField(field: string, value: string) {
    return this.adapter.enterField(field, value);
  }
  leaveFieldEmpty(field: string) {
    return this.adapter.leaveFieldEmpty(field);
  }
  leaveCardNumberEmpty() {
    return this.adapter.leaveCardNumberEmpty();
  }
  enterCardNumber(n: string) {
    return this.adapter.enterCardNumber(n);
  }
  enterExpiryDate(d: string) {
    return this.adapter.enterExpiryDate(d);
  }
  enterCVV(cvv: string) {
    return this.adapter.enterCVV(cvv);
  }
  completeLiqPayTransaction() {
    return this.adapter.completeLiqPayTransaction();
  }
  enterPromoCode(code: string) {
    return this.adapter.enterPromoCode(code);
  }

  // Order management
  cancelOrder(id: string) {
    return this.adapter.cancelOrder(id);
  }

  // Result queries
  getOrderStatus(id: string) {
    return this.adapter.getOrderStatus(id);
  }
  getOrders() {
    return this.adapter.getOrders();
  }
  isOrderConfirmationVisible() {
    return this.adapter.isOrderConfirmationVisible();
  }
  getOrderTotalText() {
    return this.adapter.getOrderTotalText();
  }
}
