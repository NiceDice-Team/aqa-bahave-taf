export interface CartItem {
  productId: string;
  quantity: number;
}

export interface ICart {
  // ── Navigation ─────────────────────────────────────────────────────────────
  navigateToCart(): Promise<void>;
  navigateToProductByName(productName: string): Promise<void>;

  // ── High-level actions (coarse steps + API adapter) ────────────────────────
  addToCart(productId: string, quantity: number): Promise<void>;
  updateQuantity(productId: string, quantity: number): Promise<void>;
  removeFromCart(productId: string): Promise<void>;
  applyPromoCode(code: string): Promise<void>;
  proceedToCheckout(): Promise<void>;

  // ── Fine-grained UI actions (web adapter implements; API stubs return void) ─
  addFirstProductToCart(): Promise<string>;
  clickAddToCart(): Promise<void>;
  setQuantity(quantity: string): Promise<void>;
  clickRemove(productName: string): Promise<void>;

  // ── Queries ────────────────────────────────────────────────────────────────
  viewCart(): Promise<void>;
  getSubtotal(): Promise<string>;
  getSubtotalValue(): Promise<number>;
  getItemQuantity(productName: string): Promise<number>;
  getItemLineTotal(productName: string): Promise<number>;
  isProductInCart(productName: string): Promise<boolean>;
  isCartEmpty(): Promise<boolean>;
  getCartItems(): Promise<CartItem[]>;
}
