import type {
  RegisterParams,
  LoginParams,
  PasswordResetParams,
  RegistrationStatus,
  OAuthProvider,
} from '../../interfaces/auth.interface';

export type { RegisterParams, LoginParams, PasswordResetParams, RegistrationStatus, OAuthProvider };

export interface SDKOptions {
  adapterType: 'web' | 'api' | 'both';
}

export interface IAuthSDK {
  openRegistrationPage(path: string): Promise<void>;
  navigateToRegistration(): Promise<void>;
  enterFirstName(firstName: string): Promise<void>;
  enterLastName(lastName: string): Promise<void>;
  enterEmail(email: string): Promise<void>;
  enterPassword(password: string): Promise<void>;
  enterConfirmPassword(password: string): Promise<void>;
  setPrivacyPolicyAcceptance(accepted: boolean): Promise<void>;
  fillRegistrationForm(params: Partial<RegisterParams>): Promise<void>;
  clickButton(buttonText: string): Promise<void>;
  handleConfirmationDialog(button: string): Promise<void>;

  register(params: RegisterParams): Promise<void>;
  login(params: LoginParams): Promise<void>;
  loginWithOAuth(provider: OAuthProvider): Promise<void>;
  continueAsGuest(): Promise<void>;
  logout(): Promise<void>;

  forgotPassword(email: string): Promise<void>;
  resetPassword(params: PasswordResetParams): Promise<void>;

  verifyEmail(token: string): Promise<void>;
  resendVerificationEmail(email: string): Promise<void>;
  getAuthStatus(): Promise<{ isAuthenticated: boolean; user?: unknown }>;
  getValidationErrors(): Promise<string[]>;
  getActivationMessage(): Promise<string | null>;
  getRegistrationStatus(email: string): Promise<RegistrationStatus>;
  checkVerificationEmailStatus(email: string): Promise<{ isSent: boolean }>;
}

export interface ICartSDK {
  addToCart(productId: string, quantity: number): Promise<void>;
  removeFromCart(productId: string): Promise<void>;
  updateQuantity(productId: string, quantity: number): Promise<void>;
  getCart(): Promise<any>;
  clearCart(): Promise<void>;
  applyPromoCode(code: string): Promise<void>;
  removePromoCode(): Promise<void>;
  getTotal(): Promise<number>;
  getSubtotal(): Promise<number>;
  getTaxes(): Promise<number>;
}

export interface IProductSDK {
  getProducts(filters?: any): Promise<any[]>;
  getProduct(id: string): Promise<any>;
  searchProducts(query: string): Promise<any[]>;
  getCategories(): Promise<any[]>;
  getProductsByCategory(categoryId: string): Promise<any[]>;
  getProductReviews(productId: string): Promise<any[]>;
  addProductReview(productId: string, review: any): Promise<void>;
}

export interface ICheckoutSDK {
  initializeCheckout(): Promise<void>;
  setShippingAddress(address: any): Promise<void>;
  setBillingAddress(address: any): Promise<void>;
  setShippingMethod(method: string): Promise<void>;
  setPaymentMethod(method: string): Promise<void>;
  validateOrder(): Promise<boolean>;
  placeOrder(): Promise<string>;
  getOrderStatus(orderId: string): Promise<any>;
  getShippingMethods(): Promise<any[]>;
  getPaymentMethods(): Promise<any[]>;
}