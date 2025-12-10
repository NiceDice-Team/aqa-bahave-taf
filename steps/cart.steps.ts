import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { CartSDK } from '../sdk';
import { CartApiAdapter } from '../adapters';

Given('I am on the cart page', async function(this: CustomWorld) {
  if (!this.cart) {
    const adapter = new CartApiAdapter(); // or AdapterType.API based on your test context
    const cartSdk = new CartSDK(adapter);
  }
});

When('I add product {string} to cart', async function(this: CustomWorld, productId: string) {
  await this.cart.addToCart(productId);
});

When('I remove product {string} from cart', async function(this: CustomWorld, productId: string) {
  await this.cart.removeItem(productId);
});

Then('the cart should be empty', async function(this: CustomWorld) {
  const isEmpty = await this.cart.isEmpty();
  // Note: You would typically use expect from @playwright/test here
  if (!isEmpty) {
    throw new Error('Cart is not empty');
  }
});

Then('the cart total should be {float}', async function(this: CustomWorld, expected: number) {
  const total = await this.cart.getTotal();
  if (total !== expected) {
    throw new Error(`Expected cart total to be ${expected}, but got ${total}`);
  }
});