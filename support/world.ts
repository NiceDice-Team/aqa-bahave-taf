import { CartPage } from '../page-objects/cart-page';
import { Page } from '@playwright/test';
import { AuthSDK } from '../sdk/auth-sdk';
import { CartSDK } from '../sdk/cart-sdk';
import { ProductSDK } from '../sdk/product-sdk';
import { CheckoutSDK } from '../sdk/checkout-sdk';
import { RegisterPage } from '../page-objects';
import { config, EnvironmentConfig } from '../config/environment';
import { fixtureLoader } from '../utils/fixture-loader';
import { BasePage } from '../page-objects/base-page';
import { AuthWebAdapter } from '../adapters/auth.web.adapter';
import { AuthApiAdapter } from '../adapters/auth.api.adapter';
import { CartWebAdapter } from '../adapters/cart.web.adapter';
import { CartApiAdapter } from '../adapters/cart.api.adapter';
import { ProductWebAdapter } from '../adapters/product.web.adapter';
import { ProductApiAdapter } from '../adapters/product.api.adapter';
import { CheckoutWebAdapter } from '../adapters/checkout.web.adapter';
import { CheckoutApiAdapter } from '../adapters/checkout.api.adapter';

export type AdapterType = 'web' | 'api' | 'both';

export class CustomWorld {
  private _cartPage: CartPage | undefined;
  private _registrationPage: RegisterPage | undefined;
  private _adapterType: AdapterType = 'both';
  private _ui: BasePage | undefined;

  private _auth: AuthSDK | undefined;
  private _cart: CartSDK | undefined;
  private _product: ProductSDK | undefined;
  private _checkout: CheckoutSDK | undefined;

  public readonly config: EnvironmentConfig = config;
  public readonly fixtures = fixtureLoader;
  public testData: Record<string, any> = {};

  constructor(public readonly page: Page) {}

  get cart(): CartPage {
    if (!this._cartPage) this._cartPage = new CartPage(this.page);
    return this._cartPage;
  }

  get registration(): RegisterPage {
    if (!this._registrationPage) this._registrationPage = new RegisterPage(this.page);
    return this._registrationPage;
  }

  get ui(): BasePage {
    if (!this._ui) this._ui = new BasePage(this.page);
    return this._ui;
  }

  get sdk() {
    return {
      auth: this.getAuthSDK(),
      cart: this.getCartSDK(),
      product: this.getProductSDK(),
      checkout: this.getCheckoutSDK(),
    };
  }

  useAdapter(type: AdapterType) {
    this._adapterType = type;
    this._auth = this._cart = this._product = this._checkout = undefined;
  }

  private getAuthSDK(): AuthSDK {
    if (!this._auth) {
      const adapter =
        this._adapterType === 'api' ? new AuthApiAdapter(this.page.request) : new AuthWebAdapter(this.page);
      this._auth = new AuthSDK(adapter);
    }
    return this._auth;
  }

  private getCartSDK(): CartSDK {
    if (!this._cart) {
      const adapter =
        this._adapterType === 'api' ? new CartApiAdapter(this.page.request) : new CartWebAdapter(this.page);
      this._cart = new CartSDK(adapter);
    }
    return this._cart;
  }

  private getProductSDK(): ProductSDK {
    if (!this._product) {
      const adapter =
        this._adapterType === 'api' ? new ProductApiAdapter(this.page.request) : new ProductWebAdapter(this.page);
      this._product = new ProductSDK(adapter);
    }
    return this._product;
  }

  private getCheckoutSDK(): CheckoutSDK {
    if (!this._checkout) {
      const adapter =
        this._adapterType === 'api' ? new CheckoutApiAdapter(this.page.request) : new CheckoutWebAdapter(this.page);
      this._checkout = new CheckoutSDK(adapter);
    }
    return this._checkout;
  }
}

export const customWorldFixture = async ({ page }: { page: Page }, use: any) => {
  const world = new CustomWorld(page);
  await use(world);
};
