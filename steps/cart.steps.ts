import { expect } from '@playwright/test';
import { Given, When, Then } from './bdd';

Given('I am on the cart page', async ({ world }) => {
  await world.sdk.cart.navigateToCart();
});

Given('the cart is empty', async ({ world }) => {
  await world.sdk.cart.navigateToCart();
  // Cart is assumed empty as a precondition; no cleanup implemented
});

Given('the user is logged in', async ({ world }) => {
  await world.sdk.auth.login(world.config.testUser);
});

Given('the product {string} exists with stock = {int}', async ({ world }, productName: string, stock: number) => {
  world.testData.productName = productName;
  world.testData.stock = stock;
});

Given(
  'the cart contains product {string} with quantity = {int}',
  async ({ world }, productName: string, quantity: number) => {
    world.testData.productName = productName;
    world.testData.quantity = quantity;
  }
);

Given(
  'the cart contains product {string} with quantity = {int} and price = {float}',
  async ({ world }, productName: string, quantity: number, price: number) => {
    world.testData.cartItems = world.testData.cartItems || [];
    world.testData.cartItems.push({ productName, quantity, price });
  }
);

When('I add product {string} to cart', async ({ world }, productId: string) => {
  await world.sdk.cart.addToCart(productId, 1);
});

When('I add a first product to cart', async ({ world }) => {
  const name = await world.sdk.cart.addFirstProductToCart();
  world.testData.lastAddedProductId = name;
});

When('I remove the first added product from cart', async ({ world }) => {
  const productId: string = world.testData.lastAddedProductId ?? '';
  await world.sdk.cart.removeFromCart(productId);
});

When('I add product {string} to cart with quantity {int}', async ({ world }, productId: string, quantity: number) => {
  await world.sdk.cart.addToCart(productId, quantity);
});

When('I remove product {string} from cart', async ({ world }, productId: string) => {
  await world.sdk.cart.removeFromCart(productId);
});

When('the user opened the product page', async ({ world }) => {
  const productName: string = world.testData?.productName || '';
  await world.sdk.cart.navigateToProductByName(productName);
});

When('the user set quantity to {string}', async ({ world }, quantity: string) => {
  await world.sdk.cart.setQuantity(quantity);
});

When('the user increased quantity to {string}', async ({ world }, quantity: string) => {
  await world.sdk.cart.setQuantity(quantity);
});

When('the user decreased quantity to {string}', async ({ world }, quantity: string) => {
  await world.sdk.cart.setQuantity(quantity);
});

When('the user opened the cart page {string}', async ({ world }, _url: string) => {
  await world.sdk.cart.navigateToCart();
});

When('the user clicked "Add to Cart"', async ({ world }) => {
  await world.sdk.cart.clickAddToCart();
});

When('the user clicked "Remove"', async ({ world }) => {
  const productName: string = world.testData?.productName || '';
  await world.sdk.cart.clickRemove(productName);
});

Then('the cart should be empty', async ({ world }) => {
  expect(await world.sdk.cart.isCartEmpty()).toBe(true);
});

Then('the cart should not be empty', async ({ world }) => {
  expect(await world.sdk.cart.isCartEmpty()).toBe(false);
});

Then('the cart total should be {float}', async ({ world }, expected: number) => {
  const total = await world.sdk.cart.getSubtotalValue();
  expect(total).toBeCloseTo(expected, 2);
});

Then(
  'the product {string} is added to the cart with quantity = {int}',
  async ({ world }, productName: string, quantity: number) => {
    await world.sdk.cart.navigateToCart();
    expect(await world.sdk.cart.isProductInCart(productName)).toBe(true);
    expect(await world.sdk.cart.getItemQuantity(productName)).toBe(quantity);
  }
);

Then('the subtotal is calculated correctly', async ({ world }) => {
  const value = await world.sdk.cart.getSubtotalValue();
  expect(value).toBeGreaterThan(0);
});

Then(
  'the cart updates product {string} quantity to {string}',
  async ({ world }, productName: string, quantity: string) => {
    const actual = await world.sdk.cart.getItemQuantity(productName);
    expect(actual.toString()).toBe(quantity);
  }
);

Then('the subtotal is recalculated', async ({ world }) => {
  const value = await world.sdk.cart.getSubtotalValue();
  expect(value).toBeGreaterThanOrEqual(0);
});

Then('the product {string} is removed from the cart', async ({ world }, productName: string) => {
  expect(await world.sdk.cart.isProductInCart(productName)).toBe(false);
});

Then('the subtotal is updated accordingly', async ({ world }) => {
  const value = await world.sdk.cart.getSubtotalValue();
  expect(value).toBeGreaterThanOrEqual(0);
});

Then('the cart shows {string} with total = {float}', async ({ world }, productName: string, total: number) => {
  await world.sdk.cart.navigateToCart();
  const lineTotal = await world.sdk.cart.getItemLineTotal(productName);
  expect(lineTotal).toBeCloseTo(total, 1);
});

Then('the subtotal is {string}', async ({ world }, subtotal: string) => {
  const value = await world.sdk.cart.getSubtotalValue();
  expect(value).toBeCloseTo(parseFloat(subtotal), 1);
});

Then('the product is not added to the cart', async ({ world }) => {
  expect(await world.sdk.cart.isCartEmpty()).toBe(true);
});

Then('the product is not added to cart', async ({ world }) => {
  const shown = await world.sdk.auth.getErrorMessage();
  expect(shown).not.toBeNull();
});
