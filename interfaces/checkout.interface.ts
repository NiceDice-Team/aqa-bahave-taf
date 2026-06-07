export interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PaymentDetails {
  method: 'credit_card' | 'liqpay';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface OrderStatus {
  orderId: string;
  status: 'new' | 'paid' | 'canceled';
  total: number;
}

export interface ICheckout {
  // ── Navigation ─────────────────────────────────────────────────────────────
  navigateToCheckoutPage(url: string): Promise<void>;

  // ── High-level form filling ────────────────────────────────────────────────
  startCheckout(): Promise<void>;
  fillShippingDetails(details: ShippingDetails): Promise<void>;
  useShippingAsBilling(): Promise<void>;
  fillPaymentDetails(details: PaymentDetails): Promise<void>;
  placeOrder(): Promise<string>;

  // ── Fine-grained field interactions ───────────────────────────────────────
  selectPaymentMethod(method: string): Promise<void>;
  enterField(fieldName: string, value: string): Promise<void>;
  leaveFieldEmpty(fieldName: string): Promise<void>;
  leaveCardNumberEmpty(): Promise<void>;
  enterCardNumber(cardNumber: string): Promise<void>;
  enterExpiryDate(date: string): Promise<void>;
  enterCVV(cvv: string): Promise<void>;
  completeLiqPayTransaction(): Promise<void>;

  // ── Promo codes ───────────────────────────────────────────────────────────
  enterPromoCode(code: string): Promise<void>;

  // ── Order management ──────────────────────────────────────────────────────
  cancelOrder(orderId: string): Promise<void>;

  // ── Result queries ────────────────────────────────────────────────────────
  getOrderStatus(orderId: string): Promise<OrderStatus>;
  getOrders(): Promise<OrderStatus[]>;
  isOrderConfirmationVisible(): Promise<boolean>;
  getOrderTotalText(): Promise<string>;
}
