import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { Given, When, Then, Before } from './bdd';
import { CustomWorld } from '../support/world';

const uatPassword = 'UatJourney123';

const assertUatTargets = (world: CustomWorld): void => {
  const frontendHost = new URL(world.config.frontendBaseUrl).hostname;
  const apiHost = new URL(world.config.apiBaseUrl).hostname;
  if (world.config.nodeEnv !== 'staging' || !frontendHost.startsWith('nd-uat.') || !apiHost.startsWith('nd-api.')) {
    throw new Error(
      `Refusing to run @uat-order against NODE_ENV=${world.config.nodeEnv}, frontend=${frontendHost}, api=${apiHost}`
    );
  }
};

const registerAndActivate = async (world: CustomWorld): Promise<void> => {
  const email = `uat.order.${Date.now()}.${faker.string.alphanumeric(6).toLowerCase()}@example.test`;
  world.testData.registrationEmail = email;
  await world.sdk.auth.openRegistrationPage('/register');
  await world.sdk.auth.register({
    firstName: 'Uat',
    lastName: 'Customer',
    email,
    password: uatPassword,
    confirmPassword: uatPassword,
    privacyPolicyAccepted: true,
  });
  expect(await world.sdk.auth.isOnPath('/confirm-signup')).toBe(true);
  expect(await world.sdk.auth.activateAccountFromLocalEmail(email)).toBe(true);
  await world.sdk.auth.login({ email, password: uatPassword });
  expect(await world.sdk.auth.isAuthenticated()).toBe(true);
};

const addFirstProduct = async (world: CustomWorld): Promise<void> => {
  await world.sdk.product.navigateToCatalog();
  expect(await world.sdk.product.getCatalogProductCount()).toBeGreaterThan(0);
  await world.sdk.product.navigateToFirstProductDetail();
  await world.sdk.product.clickProductAddToCart();
  await world.sdk.cart.navigateToCart();
  expect(await world.sdk.cart.isCheckoutAvailable()).toBe(true);
};

const completeShipping = async (world: CustomWorld): Promise<void> => {
  await world.sdk.cart.proceedToCheckout();
  await world.sdk.checkout.fillShippingDetails({
    country: 'United States',
    firstName: 'Uat',
    lastName: 'Customer',
    email: String(world.testData.registrationEmail ?? 'uat.guest@example.test'),
    phone: '+12025550123',
    address: '123 UAT Test Street',
    city: 'Boston',
    state: 'Massachusetts',
    zipCode: '02108',
  });
  await world.sdk.checkout.continueToOrderReview();
  expect(await world.sdk.checkout.isOrderReviewVisible()).toBe(true);
};

Before({ tags: '@uat-order' }, async ({ world }) => {
  assertUatTargets(world);
});

Given('a new visitor opens the UAT catalog', async ({ world }) => {
  await world.sdk.product.navigateToCatalog();
});

Given('a newly registered and activated UAT customer', async ({ world }) => {
  await registerAndActivate(world);
});

When(/the (?:visitor|customer) adds the first purchasable UAT product to the cart/, async ({ world }) => {
  await addFirstProduct(world);
});

When('completes the UAT shipping form', async ({ world }) => {
  await completeShipping(world);
});

When('selects {string} as the UAT payment method', async ({ world }, method: string) => {
  expect(await world.sdk.checkout.isPaymentMethodAvailable(method), `${method} is not exposed by UAT checkout`).toBe(
    true
  );
  await world.sdk.checkout.selectPaymentMethod(method);
});

When('completes a Stripe test payment', async ({ world }) => {
  const method = 'Credit Card';
  expect(await world.sdk.checkout.isPaymentMethodAvailable(method), `${method} is not exposed by UAT checkout`).toBe(
    true
  );
  await world.sdk.checkout.fillPaymentDetails({
    method: 'credit_card',
    cardNumber: '4242424242424242',
    expiryDate: '1234',
    cvv: '123',
  });
  await world.sdk.checkout.submitCardPayment();
});

When('places the UAT order', async ({ world }) => {
  world.testData.orderId = await world.sdk.checkout.placeOrder();
});

Then('the UAT order is accepted', async ({ world }) => {
  expect(String(world.testData.orderId)).not.toBe('');
});
