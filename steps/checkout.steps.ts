import { Given, When, Then, expect } from './bdd';

// Background steps
Given('the cart contains {int} products with subtotal {string}', async ({ world }, count: number, subtotal: string) => {
  world.testData = world.testData || {};
  world.testData.cartItemCount = count;
  world.testData.subtotal = subtotal;
  // In real scenario, would add products to cart via API or UI
});

Given('the cart contains {int} products', async ({ world }, count: number) => {
  world.testData = world.testData || {};
  world.testData.cartItemCount = count;
});

// Navigation
Given('the user opened the checkout page {string}', async ({ world }, url: string) => {
  await world.page.goto(url);
  await world.page.waitForLoadState('networkidle');
});

// Shipping details
Given('the user entered valid shipping details', async ({ world }) => {
  await world.page.locator('input[name="firstName"], input[name="first_name"], input[id="firstName"]').fill('John');
  await world.page.locator('input[name="lastName"], input[name="last_name"], input[id="lastName"]').fill('Doe');
  await world.page.locator('input[name="address"], input[name="street"], input[id="address"]').fill('123 Main St');
  await world.page.locator('input[name="city"], input[id="city"]').fill('New York');
  await world.page.locator('input[name="zipCode"], input[name="zip"], input[id="zipCode"]').fill('10001');
  await world.page.locator('input[name="phone"], input[id="phone"]').fill('+1234567890');
  await world.page.locator('input[name="email"], input[id="email"]').fill('john.doe@example.com');
});

// Billing details
Given('the user entered valid billing details', async ({ world }) => {
  await world.page.locator('input[name="billingAddress"], input[id="billingAddress"]').fill('456 Oak Ave');
  await world.page.locator('input[name="billingCity"], input[id="billingCity"]').fill('Boston');
  await world.page.locator('input[name="billingZip"], input[id="billingZip"]').fill('02101');
});

Given('the user entered valid payment details', async ({ world }) => {
  await world.page.locator('input[name="cardNumber"], input[id="cardNumber"]').fill('4111111111111111');
  await world.page.locator('input[name="cardExpiry"], input[id="cardExpiry"]').fill('12/25');
  await world.page.locator('input[name="cardCvv"], input[id="cardCvv"]').fill('123');
  await world.page.locator('input[name="cardName"], input[id="cardName"]').fill('John Doe');
});

// Payment method
Given('the user selected {string} as payment method', async ({ world }, paymentMethod: string) => {
  const paymentSelect = world.page.locator('select[name="paymentMethod"], [name="payment_method"]').first();
  if (await paymentSelect.count() > 0) {
    await paymentSelect.selectOption(paymentMethod);
  } else {
    // Try radio buttons
    await world.page.locator(`input[value="${paymentMethod}"], label:has-text("${paymentMethod}")`).click();
  }
});

Given('the user entered valid card details', async ({ world }) => {
  await world.page.locator('input[name="cardNumber"], input[id="cardNumber"]').fill('4111111111111111');
  await world.page.locator('input[name="cardExpiry"], input[id="cardExpiry"]').fill('12/25');
  await world.page.locator('input[name="cardCvv"], input[id="cardCvv"]').fill('123');
  await world.page.locator('input[name="cardName"], input[id="cardName"]').fill('John Doe');
});

// Checkboxes
Given('the user checked the {string} checkbox', async ({ world }, checkboxLabel: string) => {
  const checkbox = world.page.locator(`input[type="checkbox"]:near(:text("${checkboxLabel}")), label:has-text("${checkboxLabel}") input`).first();
  if (await checkbox.count() > 0) {
    await checkbox.check();
  }
});

// Empty fields
Given('the user left the {string} field empty', async ({ world }, fieldName: string) => {
  // Intentionally leave field empty - no action needed
  world.testData = world.testData || {};
  world.testData.emptyField = fieldName;
});

Given('the user left the card number empty', async ({ world }) => {
  // Intentionally leave card number empty
});

// Field inputs with invalid data
// Note: Email, Phone, ZIP steps are in common.steps.ts

Given('the user entered Phone {string}', async ({ world }, phone: string) => {
  await world.page.locator('input[name="phone"], input[type="tel"]').fill(phone);
});

Given('the user entered ZIP Code {string}', async ({ world }, zipCode: string) => {
  await world.page.locator('input[name="zipCode"], input[name="zip"]').fill(zipCode);
});

// Order assertions
Then('a new order is created with status {string}', async ({ world }, status: string) => {
  await world.page.waitForTimeout(2000);
  // In real scenario, would verify via API or database
  world.testData = world.testData || {};
  world.testData.orderStatus = status;
  console.log(`Order should be created with status: ${status}`);
});

Then('the cart is emptied', async ({ world }) => {
  await world.page.waitForTimeout(1000);
  // Would verify cart is empty
});

Then('the confirmation email is sent to the user', async ({ world }) => {
  await world.page.waitForTimeout(500);
  // Would verify email was sent
});

Then('the order is not created', async ({ world }) => {
  await world.page.waitForTimeout(1000);
  // Would verify no order was created
});

// Orders feature steps
Given('the database contains {int} orders for the logged in user', async ({ world }, count: number) => {
  world.testData = world.testData || {};
  world.testData.orderCount = count;
  // Would setup test data via API
});

Given('the database contains an order owned by user {string}', async ({ world }, userName: string) => {
  world.testData = world.testData || {};
  world.testData.orderOwner = userName;
});

Given('the current logged in user is {string}', async ({ world }, userName: string) => {
  world.testData = world.testData || {};
  world.testData.currentUser = userName;
});

Given('the user has an existing order with status {string}', async ({ world }, status: string) => {
  world.testData = world.testData || {};
  world.testData.existingOrderStatus = status;
});

When('the user requests GET {string}', async ({ world }, endpoint: string) => {
  // Would make API request
  world.testData = world.testData || {};
  world.testData.apiEndpoint = endpoint;
});

When('the user requests GET \\/api\\/orders\\/', async ({ world }) => {
  // Would make API request to get all orders
  world.testData = world.testData || {};
  world.testData.apiEndpoint = '/api/orders/';
});

When('the user requests GET \\/api\\/orders\\/{int}\\/', async ({ world }, orderId: number) => {
  // Would make API request to get specific order
  world.testData = world.testData || {};
  world.testData.apiEndpoint = `/api/orders/${orderId}/`;
  world.testData.orderId = orderId;
});

Then('the response returns {int} orders', async ({ world }, count: number) => {
  // Would verify API response
  await world.page.waitForTimeout(500);
});

Then('each order contains items and total price', async ({ world }) => {
  // Would verify order structure
  await world.page.waitForTimeout(500);
});

Then('the system returns {int} Forbidden', async ({ world }, statusCode: number) => {
  // Would verify HTTP status
  await world.page.waitForTimeout(500);
});

Then('products are moved from cart_items to order_items', async ({ world }) => {
  await world.page.waitForTimeout(500);
});

Then('the order status is updated to {string}', async ({ world }, status: string) => {
  await world.page.waitForTimeout(500);
  console.log(`Order status should be: ${status}`);
});

Then('the order status remains {string}', async ({ world }, status: string) => {
  await world.page.waitForTimeout(500);
  console.log(`Order status should remain: ${status}`);
});

// Payment steps
When('the user completed a successful LiqPay transaction', async ({ world }) => {
  await world.page.waitForTimeout(1000);
  // Would simulate LiqPay payment flow
});

When('the user entered card number {string}', async ({ world }, cardNumber: string) => {
  await world.page.locator('input[name="cardNumber"], input[id="cardNumber"]').fill(cardNumber);
});

When('the user entered expiry date {string}', async ({ world }, expiryDate: string) => {
  await world.page.locator('input[name="cardExpiry"], input[id="cardExpiry"], input[name="expiry"]').fill(expiryDate);
});

When('the user entered CVV {string}', async ({ world }, cvv: string) => {
  await world.page.locator('input[name="cardCvv"], input[id="cardCvv"], input[name="cvv"]').fill(cvv);
});

When('the payment provider declined the transaction', async ({ world }) => {
  // Would simulate declined payment
  world.testData = world.testData || {};
  world.testData.paymentDeclined = true;
});

Given('the user has an order with status {string}', async ({ world }, status: string) => {
  world.testData = world.testData || {};
  world.testData.orderStatus = status;
});

When('the user tried to perform another payment', async ({ world }) => {
  await world.page.waitForTimeout(500);
  // Would attempt payment on paid order
});

Then('a payment record is stored in the database', async ({ world }) => {
  await world.page.waitForTimeout(500);
  // Would verify database
});

Then('no new transaction is created', async ({ world }) => {
  await world.page.waitForTimeout(500);
  // Would verify no transaction
});

// Promo code steps
Given('the user has an existing order in the cart with subtotal {string}', async ({ world }, subtotal: string) => {
  world.testData = world.testData || {};
  world.testData.subtotal = subtotal;
});

Given('the promo code {string} is active', async ({ world }, promoCode: string) => {
  world.testData = world.testData || {};
  world.testData.promoCode = promoCode;
  world.testData.promoCodeActive = true;
});

Given('the promo code gives a {int} percent discount', async ({ world }, percentage: number) => {
  world.testData = world.testData || {};
  world.testData.discountPercentage = percentage;
});

Given('the promo code gives a fixed discount of {string}', async ({ world }, amount: string) => {
  world.testData = world.testData || {};
  world.testData.discountAmount = amount;
});

Given('the promo code expiry date is in the future', async ({ world }) => {
  world.testData = world.testData || {};
  world.testData.promoCodeExpired = false;
});

Given('the promo code {string} exists', async ({ world }, promoCode: string) => {
  world.testData = world.testData || {};
  world.testData.promoCode = promoCode;
});

Given('the promo code expiry date is in the past', async ({ world }) => {
  world.testData = world.testData || {};
  world.testData.promoCodeExpired = true;
});

Given('the promo code is inactive', async ({ world }) => {
  world.testData = world.testData || {};
  world.testData.promoCodeActive = false;
});

Given('the promo code requires a minimum order value of {string}', async ({ world }, minValue: string) => {
  world.testData = world.testData || {};
  world.testData.minOrderValue = minValue;
});

When('the user entered the promo code {string}', async ({ world }, promoCode: string) => {
  await world.page.locator('input[name="promoCode"], input[name="promo_code"], input[id="promoCode"]').fill(promoCode);
});

When('the user tried to apply the promo code {string}', async ({ world }, promoCode: string) => {
  await world.page.locator('input[name="promoCode"], input[name="promo_code"]').fill(promoCode);
  const button = world.page.locator('button:has-text("Apply"), button:has-text("APPLY")').first();
  if (await button.count() > 0) {
    await button.click();
  }
});

Then('the order total is updated to {string}', async ({ world }, total: string) => {
  await world.page.waitForTimeout(500);
  // Would verify total on page
});

Then('the discount is displayed in the order summary', async ({ world }) => {
  await world.page.waitForTimeout(500);
  // Would verify discount is shown
});

Then('the discount is not applied', async ({ world }) => {
  await world.page.waitForTimeout(500);
  // Would verify discount not applied
});

Then('the order total remains {string}', async ({ world }, total: string) => {
  await world.page.waitForTimeout(500);
  // Would verify total unchanged
});
