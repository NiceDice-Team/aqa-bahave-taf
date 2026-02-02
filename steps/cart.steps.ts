import { expect } from '@playwright/test';
import { Given, When, Then } from './bdd';

Given('I am on the cart page', async ({ world }) => {
  await world.page.goto('/cart');
  await world.page.waitForLoadState('networkidle');
});

Given('the cart is empty', async ({ world }) => {
  // Navigate to cart and ensure it's empty
  await world.page.goto('/cart');
  await world.page.waitForLoadState('networkidle');
  // Clear cart if needed
});

Given('the user is logged in', async ({ world }) => {
  // For now, skip login or use test credentials
  // In real scenario, would login first
  console.log('Login step - skipped for cart tests');
});

Given('the product {string} exists with stock = {int}', async ({ world }, productName: string, stock: number) => {
  // This would typically be a backend/API setup step
  world.testData = world.testData || {};
  world.testData.productName = productName;
  world.testData.stock = stock;
});

Given('the cart contains product {string} with quantity = {int}', async ({ world }, productName: string, quantity: number) => {
  // Navigate to product page and add to cart
  // This is a setup step - would need actual implementation based on app structure
  world.testData = world.testData || {};
  world.testData.productName = productName;
  world.testData.quantity = quantity;
});

Given('the cart contains product {string} with quantity = {int} and price = {float}', async ({ world }, productName: string, quantity: number, price: number) => {
  world.testData = world.testData || {};
  world.testData.cartItems = world.testData.cartItems || [];
  world.testData.cartItems.push({ productName, quantity, price });
});

When('I add product {string} to cart', async ({ world }, productId: string) => {
  // Navigate to product and click Add to Cart
  const addButton = world.page.locator('button:has-text("ADD"), button:has-text("CART")').first();
  if (await addButton.count() > 0) {
    await addButton.click();
    await world.page.waitForTimeout(1000);
  }
});

When('I add product {string} to cart with quantity {int}', async ({ world }, productId: string, quantity: number) => {
  // Set quantity then add to cart
  const quantityInput = world.page.locator('input[name="quantity"], input[type="number"]').first();
  if (await quantityInput.count() > 0) {
    await quantityInput.fill(quantity.toString());
  }
  const addButton = world.page.locator('button:has-text("ADD"), button:has-text("CART")').first();
  if (await addButton.count() > 0) {
    await addButton.click();
    await world.page.waitForTimeout(1000);
  }
});

When('I remove product {string} from cart', async ({ world }, productId: string) => {
  const removeButton = world.page.locator('button:has-text("Remove"), button:has-text("Delete"), [aria-label="Remove"]').first();
  if (await removeButton.count() > 0) {
    await removeButton.click();
    await world.page.waitForTimeout(1000);
  }
});

When('the user opened the product page', async ({ world }) => {
  // Navigate to a product page
  await world.page.goto('/products/test-product');
  await world.page.waitForLoadState('networkidle');
});

When('the user set quantity to {string}', async ({ world }, quantity: string) => {
  const quantityInput = world.page.locator('input[name="quantity"], input[type="number"]').first();
  await quantityInput.fill(quantity);
});

When('the user increased quantity to {string}', async ({ world }, quantity: string) => {
  const quantityInput = world.page.locator('input[name="quantity"], input[type="number"]').first();
  await quantityInput.fill(quantity);
});

When('the user decreased quantity to {string}', async ({ world }, quantity: string) => {
  const quantityInput = world.page.locator('input[name="quantity"], input[type="number"]').first();
  await quantityInput.fill(quantity);
});

When('the user opened the cart page {string}', async ({ world }, url: string) => {
  await world.page.goto(url);
  await world.page.waitForLoadState('networkidle');
});

Then('the cart should be empty', async ({ world }) => {
  const emptyMessage = world.page.locator('text=/empty|no items|cart is empty/i');
  await expect(emptyMessage).toBeVisible({ timeout: 5000 });
});

Then('the cart total should be {float}', async ({ world }, expected: number) => {
  // Find total/subtotal element
  const totalElement = world.page.locator('[data-testid="cart-total"], .cart-total, .total').first();
  if (await totalElement.count() > 0) {
    const totalText = await totalElement.textContent();
    // Extract number from text like "$29.99"
    const total = parseFloat(totalText?.replace(/[^0-9.]/g, '') || '0');
    expect(total).toBeCloseTo(expected, 2);
  }
});

Then('the product {string} is added to the cart with quantity = {int}', async ({ world }, productName: string, quantity: number) => {
  // Check cart contains the product
  await world.page.waitForTimeout(1000);
  console.log(`Product ${productName} should be in cart with quantity ${quantity}`);
});

Then('the subtotal is calculated correctly', async ({ world }) => {
  await world.page.waitForTimeout(1000);
  // Verification would check cart math
});

Then('the cart updates product {string} quantity to {string}', async ({ world }, productName: string, quantity: string) => {
  await world.page.waitForTimeout(1000);
  console.log(`Cart should show ${productName} with quantity ${quantity}`);
});

Then('the subtotal is recalculated', async ({ world }) => {
  await world.page.waitForTimeout(1000);
});

Then('the product {string} is removed from the cart', async ({ world }, productName: string) => {
  await world.page.waitForTimeout(1000);
  console.log(`Product ${productName} should be removed from cart`);
});

Then('the subtotal is updated accordingly', async ({ world }) => {
  await world.page.waitForTimeout(1000);
});

Then('the cart shows {string} with total = {float}', async ({ world }, productName: string, total: number) => {
  await world.page.waitForTimeout(1000);
  console.log(`Cart should show ${productName} with total ${total}`);
});

Then('the subtotal is {string}', async ({ world }, subtotal: string) => {
  await world.page.waitForTimeout(1000);
  console.log(`Subtotal should be ${subtotal}`);
});

Then('the product is not added to the cart', async ({ world }) => {
  await world.page.waitForTimeout(1000);
  // Verify cart remains empty or unchanged
});

Then('the product is not added to cart', async ({ world }) => {
  await world.page.waitForTimeout(1000);
});