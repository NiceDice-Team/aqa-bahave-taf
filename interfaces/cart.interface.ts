export interface CartItem {
  productId: string;
  quantity: number;
}

export interface ICart {
  addToCart(productId: string, quantity: number): Promise<void>;
  updateQuantity(productId: string, quantity: number): Promise<void>;
  removeFromCart(productId: string): Promise<void>;
  viewCart(): Promise<void>;
  applyPromoCode(code: string): Promise<void>;
  proceedToCheckout(): Promise<void>;
  getSubtotal(): Promise<string>;
  isCartEmpty(): Promise<boolean>;
  getCartItems(): Promise<CartItem[]>;
}