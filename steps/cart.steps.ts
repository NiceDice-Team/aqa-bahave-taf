import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

Given('I am on the cart page', async function(this: CustomWorld) {
  await this.cart.goto('/cart');
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
  const total = await this.cart.getCartTotal();
  if (total !== expected) {
    throw new Error(`Cart total is ${total}, expected ${expected}`);
  }
});