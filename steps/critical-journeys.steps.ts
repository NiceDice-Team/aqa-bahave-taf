import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { Given, When, Then } from './bdd';

const localCustomer = {
  email: 'customer@nicedice.com',
  password: 'Secret12345',
};

Given('a visitor is on the local registration page', async ({ world }) => {
  await world.sdk.auth.openRegistrationPage('/register');
});

When('the visitor submits a unique valid registration', async ({ world }) => {
  const email = `critical.${Date.now()}.${faker.string.alphanumeric(6).toLowerCase()}@example.test`;
  world.testData.registrationEmail = email;
  world.testData.registrationPassword = 'LocalPass123';
  await world.sdk.auth.register({
    firstName: 'Critical',
    lastName: 'Journey',
    email,
    password: 'LocalPass123',
    confirmPassword: 'LocalPass123',
    privacyPolicyAccepted: true,
  });
});

Then('the registration is accepted', async ({ world }) => {
  const accepted = await world.sdk.auth.isOnPath('/confirm-signup');
  if (!accepted) throw new Error((await world.sdk.auth.getErrorMessage()) ?? 'Registration was not accepted');
});

When('the visitor follows the activation link from local Mailcatcher', async ({ world }) => {
  expect(await world.sdk.auth.activateAccountFromLocalEmail(String(world.testData.registrationEmail))).toBe(true);
});

Then('the activated customer can sign in', async ({ world }) => {
  await world.sdk.auth.login({
    email: String(world.testData.registrationEmail),
    password: String(world.testData.registrationPassword),
  });
  const authenticated = await world.sdk.auth.isAuthenticated();
  if (!authenticated)
    throw new Error((await world.sdk.auth.getErrorMessage()) ?? 'Activated account could not sign in');
});

Given('a visitor is on the local password recovery page', async ({ world }) => {
  await world.sdk.auth.openPasswordRecoveryPage('/forgot-password');
});

When('the visitor requests a reset for the local customer', async ({ world }) => {
  await world.sdk.auth.requestPasswordReset(localCustomer.email);
});

Then('the reset request is accepted without revealing account state', async ({ world }) => {
  const accepted = await world.sdk.auth.isOnPath('/forgot-password/success');
  if (!accepted) throw new Error((await world.sdk.auth.getErrorMessage()) ?? 'Password reset request was rejected');
});

Given('a visitor is on the local login page', async ({ world }) => {
  await world.sdk.auth.openLoginPage('/login');
});

When('the visitor signs in as the local customer', async ({ world }) => {
  await world.sdk.auth.login(localCustomer);
});

Then('the customer is authenticated', async ({ world }) => {
  const authenticated = await world.sdk.auth.isAuthenticated();
  if (!authenticated) throw new Error((await world.sdk.auth.getErrorMessage()) ?? 'Local login did not authenticate');
});

Given('a visitor opens the local catalog', async ({ world }) => {
  await world.sdk.product.navigateToCatalog();
});

Then('purchasable products are listed', async ({ world }) => {
  expect(await world.sdk.product.getCatalogProductCount()).toBeGreaterThan(0);
});

When('the visitor opens the first listed product', async ({ world }) => {
  await world.sdk.product.navigateToFirstProductDetail();
});

Then('its product details and purchase action are visible', async ({ world }) => {
  expect(await world.sdk.product.isProductTitleVisible()).toBe(true);
  expect(await world.sdk.product.isProductPriceVisible()).toBe(true);
  expect(await world.sdk.product.isProductAddToCartButtonVisible()).toBe(true);
});

Given('the local customer is signed in with an empty cart', async ({ world }) => {
  await world.sdk.auth.login(localCustomer);
  const authenticated = await world.sdk.auth.isAuthenticated();
  if (!authenticated) throw new Error((await world.sdk.auth.getErrorMessage()) ?? 'Local login did not authenticate');
  await world.sdk.cart.clearCart();
  expect(await world.sdk.cart.isCartEmpty()).toBe(true);
});

When('the customer opens a product from the catalog', async ({ world }) => {
  await world.sdk.product.navigateToFirstProductDetail();
  const productName = (await world.sdk.product.getProductTitle()).trim();
  expect(productName).not.toBe('');
  world.testData.selectedProductName = productName;
});

When('adds the selected product to the cart', async ({ world }) => {
  await world.sdk.product.clickProductAddToCart();
  expect(await world.sdk.product.isCartConfirmationVisible()).toBe(true);
  await world.sdk.cart.navigateToCart();
});

Then('the selected product is shown in the cart with quantity {int}', async ({ world }, quantity: number) => {
  const productName = String(world.testData.selectedProductName);
  expect(await world.sdk.cart.isProductInCart(productName)).toBe(true);
  expect(await world.sdk.cart.getItemQuantity(productName)).toBe(quantity);
  expect(await world.sdk.cart.isCheckoutAvailable()).toBe(true);
});

When('the customer increases the selected product quantity', async ({ world }) => {
  await world.sdk.cart.increaseItemQuantity(String(world.testData.selectedProductName));
});

Then('the selected product quantity is {int} and the subtotal is positive', async ({ world }, quantity: number) => {
  const productName = String(world.testData.selectedProductName);
  expect(await world.sdk.cart.getItemQuantity(productName)).toBe(quantity);
  expect(await world.sdk.cart.getSubtotalValue()).toBeGreaterThan(0);
});

When('the customer proceeds to checkout with a valid local shipping address', async ({ world }) => {
  await world.sdk.cart.proceedToCheckout();
  await world.sdk.checkout.fillShippingDetails({
    country: 'United States',
    firstName: 'Critical',
    lastName: 'Journey',
    email: localCustomer.email,
    phone: '+12025550123',
    address: '123 Local Street',
    city: 'Boston',
    state: 'Massachusetts',
    zipCode: '02108',
  });
  await world.sdk.checkout.continueToOrderReview();
});

Then('the order review shows the selected product and allows order placement', async ({ world }) => {
  expect(await world.sdk.checkout.isOrderReviewVisible()).toBe(true);
  expect(await world.sdk.checkout.isOrderSummaryVisible()).toBe(true);
  expect(await world.sdk.cart.isProductInCart(String(world.testData.selectedProductName))).toBe(true);
  expect(await world.sdk.checkout.isPlaceOrderAvailable()).toBe(true);
});
