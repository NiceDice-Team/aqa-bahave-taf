import { CartPage } from '../page-objects/cart-page';
import { Page } from '@playwright/test';
import { AuthSDK } from '../sdk/auth-sdk';
import { CartSDK } from '../sdk/cart-sdk';
import { ProductSDK } from '../sdk/product-sdk';
import { CheckoutSDK } from '../sdk/checkout-sdk';
import { RegisterPage } from '../page-objects';
import { config, EnvironmentConfig } from '../config/environment';
import { fixtureLoader } from '../utils/fixture-loader';

export type AdapterType = 'web' | 'api' | 'both';

// CustomWorld now receives Page from Playwright's fixture
export class CustomWorld {
  private _cartPage: CartPage | undefined;
  private _registrationPage: RegisterPage | undefined;
  private _adapterType: AdapterType = 'both';

  // SDK instances
  private _auth: AuthSDK | undefined;
  private _cart: CartSDK | undefined;
  private _product: ProductSDK | undefined;
  private _checkout: CheckoutSDK | undefined;

  // Configuration and fixtures
  public readonly config: EnvironmentConfig = config;
  public readonly fixtures = fixtureLoader;

  // Test data storage
  public testData: Record<string, any> = {};

  constructor(public readonly page: Page) {}

  get cart(): CartPage {
    if (!this._cartPage) {
      this._cartPage = new CartPage(this.page);
    }
    return this._cartPage;
  }

  get registration(): RegisterPage {
    if (!this._registrationPage) {
      this._registrationPage = new RegisterPage(this.page);
    }
    return this._registrationPage;
  }

  get sdk() {
    return {
      auth: this.getAuthSDK(),
      cart: this.getCartSDK(),
      product: this.getProductSDK(),
      checkout: this.getCheckoutSDK()
    };
  }

  useAdapter(type: AdapterType) {
    this._adapterType = type;
    // Reset SDKs so they'll be recreated with new adapter type
    this._auth = undefined;
    this._cart = undefined;
    this._product = undefined;
    this._checkout = undefined;
  }

  private getAuthSDK(): AuthSDK {
    if (!this._auth) {
      if (this._adapterType === 'web') {
        const { AuthWebAdapter } = require('../adapters/auth.web.adapter');
        this._auth = new AuthSDK(new AuthWebAdapter(this.page));
      } else if (this._adapterType === 'api') {
        const { AuthApiAdapter } = require('../adapters/auth.api.adapter');
        this._auth = new AuthSDK(new AuthApiAdapter());
      } else {
        const { AuthWebAdapter } = require('../adapters/auth.web.adapter');
        this._auth = new AuthSDK(new AuthWebAdapter(this.page));
      }
    }
    return this._auth;
  }

  private getCartSDK(): CartSDK {
    if (!this._cart) {
      if (this._adapterType === 'web') {
        const { CartWebAdapter } = require('../adapters/cart.web.adapter');
        this._cart = new CartSDK(new CartWebAdapter(this.page));
      } else if (this._adapterType === 'api') {
        const { CartApiAdapter } = require('../adapters/cart.api.adapter');
        this._cart = new CartSDK(new CartApiAdapter());
      } else {
        const { CartWebAdapter } = require('../adapters/cart.web.adapter');
        this._cart = new CartSDK(new CartWebAdapter(this.page));
      }
    }
    return this._cart;
  }

  private getProductSDK(): ProductSDK {
    if (!this._product) {
      if (this._adapterType === 'web') {
        const { ProductWebAdapter } = require('../adapters/product.web.adapter');
        this._product = new ProductSDK(new ProductWebAdapter(this.page));
      } else if (this._adapterType === 'api') {
        const { ProductApiAdapter } = require('../adapters/product.api.adapter');
        this._product = new ProductSDK(new ProductApiAdapter());
      } else {
        const { ProductWebAdapter } = require('../adapters/product.web.adapter');
        this._product = new ProductSDK(new ProductWebAdapter(this.page));
      }
    }
    return this._product;
  }

  private getCheckoutSDK(): CheckoutSDK {
    if (!this._checkout) {
      if (this._adapterType === 'web') {
        const { CheckoutWebAdapter } = require('../adapters/checkout.web.adapter');
        this._checkout = new CheckoutSDK(new CheckoutWebAdapter(this.page));
      } else if (this._adapterType === 'api') {
        const { CheckoutApiAdapter } = require('../adapters/checkout.api.adapter');
        this._checkout = new CheckoutSDK(new CheckoutApiAdapter());
      } else {
        const { CheckoutWebAdapter } = require('../adapters/checkout.web.adapter');
        this._checkout = new CheckoutSDK(new CheckoutWebAdapter(this.page));
      }
    }
    return this._checkout;
  }
}

// Export as a Playwright fixture
export const customWorldFixture = async ({ page }: { page: Page }, use: any) => {
  const world = new CustomWorld(page);
  await use(world);
};