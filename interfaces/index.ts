export interface IAuthAdapter {
  login(email: string, password: string): Promise<void>;
  register(email: string, password: string, name: string): Promise<void>;
  logout(): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
}

export interface ICartAdapter {
  addToCart(productId: string, quantity: number): Promise<void>;
  removeFromCart(productId: string): Promise<void>;
  updateQuantity(productId: string, quantity: number): Promise<void>;
  getCart(): Promise<any>; // TODO: Define cart type
  clearCart(): Promise<void>;
}

export interface IProductAdapter {
  getProducts(filters?: any): Promise<any[]>; // TODO: Define product and filter types
  getProduct(id: string): Promise<any>; // TODO: Define product type
  searchProducts(query: string): Promise<any[]>;
  getCategories(): Promise<any[]>; // TODO: Define category type
}

export interface ICheckoutAdapter {
  initiateCheckout(): Promise<void>;
  submitShippingDetails(details: any): Promise<void>; // TODO: Define shipping details type
  submitPaymentDetails(details: any): Promise<void>; // TODO: Define payment details type
  confirmOrder(): Promise<void>;
  getOrderStatus(orderId: string): Promise<any>; // TODO: Define order status type
}