import { ICart } from '../interfaces/cart.interface';

export class CartSDK implements ICart {
  constructor(private adapter: ICart) {}

  // Navigation
  navigateToCart() {
    return this.adapter.navigateToCart();
  }
  navigateToProductByName(name: string) {
    return this.adapter.navigateToProductByName(name);
  }

  // High-level actions
  addToCart(id: string, qty: number) {
    return this.adapter.addToCart(id, qty);
  }
  updateQuantity(id: string, qty: number) {
    return this.adapter.updateQuantity(id, qty);
  }
  removeFromCart(id: string) {
    return this.adapter.removeFromCart(id);
  }
  viewCart() {
    return this.adapter.viewCart();
  }
  applyPromoCode(code: string) {
    return this.adapter.applyPromoCode(code);
  }
  proceedToCheckout() {
    return this.adapter.proceedToCheckout();
  }

  // Fine-grained UI actions
  addFirstProductToCart() {
    return this.adapter.addFirstProductToCart();
  }
  clickAddToCart() {
    return this.adapter.clickAddToCart();
  }
  setQuantity(qty: string) {
    return this.adapter.setQuantity(qty);
  }
  clickRemove(name: string) {
    return this.adapter.clickRemove(name);
  }

  // Queries
  getSubtotal() {
    return this.adapter.getSubtotal();
  }
  getSubtotalValue() {
    return this.adapter.getSubtotalValue();
  }
  getItemQuantity(name: string) {
    return this.adapter.getItemQuantity(name);
  }
  getItemLineTotal(name: string) {
    return this.adapter.getItemLineTotal(name);
  }
  isProductInCart(name: string) {
    return this.adapter.isProductInCart(name);
  }
  isCartEmpty() {
    return this.adapter.isCartEmpty();
  }
  getCartItems() {
    return this.adapter.getCartItems();
  }
}
