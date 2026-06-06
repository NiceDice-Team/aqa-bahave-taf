import { WebAdapter } from './base.adapters';
import { CheckoutPage } from '../page-objects/checkout-page';
import { ICheckout, ShippingDetails, PaymentDetails, OrderStatus } from '../interfaces/checkout.interface';

export class CheckoutWebAdapter extends WebAdapter implements ICheckout {
  private getCheckoutPage(): CheckoutPage {
    return new CheckoutPage(this.page);
  }

  // ── Navigation ───────────────────────────────────────────────────────

  async navigateToCheckoutPage(url: string): Promise<void> {
    await this.getCheckoutPage().navigate(url);
  }

  // ── High-level form filling ───────────────────────────────────────────────

  async startCheckout(): Promise<void> {
    await this.getCheckoutPage().proceedToCheckout();
  }

  async fillShippingDetails(details: ShippingDetails): Promise<void> {
    await this.getCheckoutPage().fillShippingDetails(details);
  }

  async useShippingAsBilling(): Promise<void> {
    await this.getCheckoutPage().checkUseShippingAsBilling();
  }

  async fillPaymentDetails(details: PaymentDetails): Promise<void> {
    const cp = this.getCheckoutPage();
    await cp.selectPaymentMethod(details.method);
    if (details.method === 'credit_card') {
      await cp.fillCardDetails({
        cardNumber: details.cardNumber,
        expiry: details.expiryDate,
        cvv: details.cvv,
      });
    }
  }

  async placeOrder(): Promise<string> {
    await this.getCheckoutPage().placeOrder();
    await this.page.waitForURL(/\/order|confirmation/, { timeout: 15000 }).catch(() => {});
    return '';
  }

  // ── Fine-grained interactions ───────────────────────────────────────────

  async selectPaymentMethod(method: string): Promise<void> {
    await this.getCheckoutPage().selectPaymentMethod(method);
  }

  async enterField(fieldName: string, value: string): Promise<void> {
    await this.getCheckoutPage().enterField(fieldName, value);
  }

  async leaveFieldEmpty(_fieldName: string): Promise<void> {
    // Intentionally do nothing — field is left empty
  }

  async leaveCardNumberEmpty(): Promise<void> {
    // Intentionally do nothing
  }

  async enterCardNumber(cardNumber: string): Promise<void> {
    await this.getCheckoutPage().enterCardNumber(cardNumber);
  }

  async enterExpiryDate(date: string): Promise<void> {
    await this.getCheckoutPage().enterExpiryDate(date);
  }

  async enterCVV(cvv: string): Promise<void> {
    await this.getCheckoutPage().enterCVV(cvv);
  }

  async completeLiqPayTransaction(): Promise<void> {
    await this.getCheckoutPage().completeLiqPayTransaction();
  }

  async enterPromoCode(code: string): Promise<void> {
    await this.getCheckoutPage().enterPromoCode(code);
  }

  // ── Order management ─────────────────────────────────────────────────────

  async cancelOrder(_orderId: string): Promise<void> {
    await this.getCheckoutPage().cancelOrder();
  }

  // ── Result queries ───────────────────────────────────────────────────────

  async getOrderStatus(_orderId: string): Promise<OrderStatus> {
    return { orderId: '', status: 'new', total: 0 };
  }

  async getOrders(): Promise<OrderStatus[]> {
    return [];
  }

  async isOrderConfirmationVisible(): Promise<boolean> {
    return this.getCheckoutPage().isOrderConfirmationVisible();
  }

  async getOrderTotalText(): Promise<string> {
    return (await this.getCheckoutPage().getTotalAmount()) ?? '';
  }
}
