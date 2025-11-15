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

export interface ICheckoutAdapter {
  startCheckout(): Promise<void>;
  fillShippingDetails(details: ShippingDetails): Promise<void>;
  useShippingAsBilling(): Promise<void>;
  fillPaymentDetails(details: PaymentDetails): Promise<void>;
  placeOrder(): Promise<string>;
  getOrderStatus(orderId: string): Promise<OrderStatus>;
  cancelOrder(orderId: string): Promise<void>;
  getOrders(): Promise<OrderStatus[]>;
}