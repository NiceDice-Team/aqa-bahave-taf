import { CartPage } from '../page-objects/cart-page';
import { chromium, Browser, Page } from '@playwright/test';
import { Before, After, setWorldConstructor, World } from '@cucumber/cucumber';
import { AuthSDK } from '../sdk/auth.sdk';
import { CartSDK } from '../sdk/cart.sdk';
import { ProductSDK } from '../sdk/product.sdk';
import { CheckoutSDK } from '../sdk/checkout.sdk';
import { RegistrationPage } from '../adapters/registration.adapter';

export type AdapterType = 'web' | 'api' | 'both';

// Extend World to include our page objects and SDKs
export class CustomWorld extends World {
  private browser: Browser | undefined;
  private _page: Page | undefined;
  private _cartPage: CartPage | undefined;
  private _registrationPage: RegistrationPage | undefined;
  private _adapterType: AdapterType = 'both';

  // SDK instances
  private _auth: AuthSDK | undefined;
  private _cart: CartSDK | undefined;
  private _product: ProductSDK | undefined;
  private _checkout: CheckoutSDK | undefined;

  // Test data storage
  public testData: Record<string, any> = {};

  get page(): Page {
    if (!this._page) {
      throw new Error('Page not initialized. Call initBrowser() first');
    }
    return this._page;
  }

  get cart(): CartPage {
    if (!this._cartPage) {
      this._cartPage = new CartPage(this.page);
    }
    return this._cartPage;
  }

  get registration(): RegistrationPage {
    if (!this._registrationPage) {
      this._registrationPage = new RegistrationPage(this.page);
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
      this._auth = new AuthSDK(this.page);
    }
    return this._auth;
  }

  private getCartSDK(): CartSDK {
    if (!this._cart) {
  this._cart = new CartSDK();
    }
    return this._cart;
  }

  private getProductSDK(): ProductSDK {
    if (!this._product) {
  this._product = new ProductSDK();
    }
    return this._product;
  }

  private getCheckoutSDK(): CheckoutSDK {
    if (!this._checkout) {
  this._checkout = new CheckoutSDK();
    }
    return this._checkout;
  }

  async initBrowser() {
    this.browser = await chromium.launch();
    this._page = await this.browser.newPage();
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = undefined;
      this._page = undefined;
      this._cartPage = undefined;
    }
  }
}

setWorldConstructor(CustomWorld);

// Hooks
Before(async function(this: CustomWorld) {
  await this.initBrowser();
});

After(async function(this: CustomWorld) {
  await this.closeBrowser();
});