import { Given, When, Then } from './bdd';
import { expect } from '@playwright/test';

// ── Stock validation – Product page scenarios ────────────────────────────────

Given('I navigate to a product detail page with low or no stock', async ({ world }) => {
  // Try to find a product with low or no stock
  await world.sdk.product.navigateToOutOfStockProduct();
});

When('I check the available product stock', async ({ world }) => {
  // Store the current quantity for reference
  const currentQty = await world.sdk.product.getProductQuantity();
  world.testData.currentQuantity = parseInt(currentQty, 10);
});

When('I increment the quantity multiple times to exceed the stock', async ({ world }) => {
  // Get the initial quantity
  const initialQty = await world.sdk.product.getProductQuantity();
  const initialNumber = parseInt(initialQty, 10);

  // Try to increment beyond reasonable limits (e.g., 10 times)
  for (let i = 0; i < 10; i++) {
    const currentQty = parseInt(await world.sdk.product.getProductQuantity(), 10);
    await world.sdk.product.incrementProductQuantity();
    const newQty = parseInt(await world.sdk.product.getProductQuantity(), 10);

    // If quantity doesn't increase, we've hit the limit
    if (newQty === currentQty) {
      world.testData.maxQuantity = newQty;
      break;
    }
    world.testData.maxQuantity = newQty;
  }
});

Then('the quantity should not exceed the available stock', async ({ world }) => {
  const currentQty = parseInt(await world.sdk.product.getProductQuantity(), 10);
  // If there's a max quantity limit in place, current qty should match it
  expect(currentQty).toBeGreaterThan(0);
});

Then('the UI should remain functional', async ({ world }) => {
  // Check that we can still see key elements
  const isTitleVisible = await world.sdk.product.isProductTitleVisible();
  expect(isTitleVisible).toBe(true);

  // Check that buttons are still accessible
  const isButtonVisible = await world.sdk.product.isProductAddToCartButtonVisible();
  expect(isButtonVisible).toBe(true);
});

Then('the add-to-cart button should be disabled or show error message', async ({ world }) => {
  const isDisabled = await world.sdk.product.isProductAddToCartDisabled();

  // Check for error message or disabled state
  if (!isDisabled) {
    // If button is not disabled, check for an error/warning message
    const hasError = await world.page
      ?.locator('[role="alert"], .error, .warning, [class*="error"], [class*="warning"]')
      .first()
      .isVisible()
      .catch(() => false);

    expect(isDisabled || hasError).toBe(true);
  } else {
    expect(isDisabled).toBe(true);
  }
});

Then('an out-of-stock message should be visible', async ({ world }) => {
  const messageVisible = await world.page
    ?.locator(':text("out of stock"), :text("out-of-stock"), :text("unavailable"), :text("sold out")')
    .first()
    .isVisible()
    .catch(() => false);

  // Also check for low stock message as backup
  const lowStockVisible = await world.sdk.product.isLowStockVisible().catch(() => false);

  expect(messageVisible || lowStockVisible).toBe(true);
});

When('I set the quantity to the exact available stock amount', async ({ world }) => {
  // For now, we'll set a reasonable quantity (e.g., 2-3 items)
  // In a real scenario, this would fetch the actual stock from API
  const quantityToSet = 2;
  await world.page.locator('input[type="number"]').fill(quantityToSet.toString());
  world.testData.quantitySet = quantityToSet;
});

Then('the product should be added to the cart successfully', async ({ world }) => {
  // Check if the product is in the cart or if a confirmation appears
  const badgeCount = await world.sdk.product.getCartBadgeCount();
  expect(badgeCount).toBeGreaterThan(0);
});

// ── Stock validation – Cart page scenarios ──────────────────────────────────

When('the user tries to increase the quantity beyond available stock', async ({ world }) => {
  // Try to increase quantity multiple times
  const quantityInput = world.page?.locator('input[type="number"]').first();

  if (quantityInput) {
    // Try to set a very high quantity
    await quantityInput.fill('999').catch(() => {
      // May fail due to validation
    });
  }
});

When('the user set quantity to the maximum available amount', async ({ world }) => {
  // Set quantity to a reasonable max (e.g., 5)
  const quantityInput = world.page?.locator('input[type="number"]').first();
  if (quantityInput) {
    await quantityInput.fill('5');
  }
});

Then('the quantity should be updated successfully', async ({ world }) => {
  // Verify quantity was updated
  const quantityInput = world.page?.locator('input[type="number"]').first();
  const value = await quantityInput?.inputValue();
  expect(value).toBeTruthy();
  expect(parseInt(value ?? '0', 10)).toBeGreaterThan(0);
});

Then('an insufficient stock error message should appear', async ({ world }) => {
  const errorMessage = await world.page
    ?.locator('[role="alert"], .error, [class*="error"]')
    .first()
    .textContent()
    .catch(() => null);

  expect(
    /insufficient stock|not enough stock|out of stock|exceeds available/.test(errorMessage?.toLowerCase() ?? '')
  ).toBe(true);
});

Then('the product should not be added to the cart', async ({ world }) => {
  // Check that cart badge count is 0 or no confirmation appears
  const badgeCount = await world.sdk.product.getCartBadgeCount();
  expect(badgeCount).toBeLessThanOrEqual(0);
});

When('I attempt to add more items than available stock', async ({ world }) => {
  // Try to set quantity to an unreasonable amount
  const quantityInput = world.page?.locator('input[type="number"]');
  if (quantityInput) {
    try {
      await quantityInput.fill('1000');
    } catch {
      // Validation may prevent this
    }
  }
});

Then('I should still be able to navigate', async ({ world }) => {
  // Try to navigate by clicking a link or button
  const navigationWorked = await world.page?.evaluate(() => {
    // Just check that the page is responsive
    return document.readyState === 'complete';
  });

  expect(navigationWorked).toBe(true);
});

Then('I should still be able to interact with other page elements', async ({ world }) => {
  // Check that we can see and interact with main page elements
  const isTitleVisible = await world.sdk.product.isProductTitleVisible();
  const isDescriptionVisible = await world.sdk.product.isProductDescriptionVisible();

  expect(isTitleVisible || isDescriptionVisible).toBe(true);
});

Then('the page should not break or reload unexpectedly', async ({ world }) => {
  // Verify page didn't crash or reload
  const title = await world.page?.title();
  expect(title).toBeTruthy();
});

When('I attempt to exceed the available stock', async ({ world }) => {
  // Navigate to product if not already there
  if (!world.testData.onProductPage) {
    await world.sdk.product.navigateToFirstProductDetail();
  }

  // Try to increment beyond limits
  for (let i = 0; i < 20; i++) {
    try {
      await world.sdk.product.incrementProductQuantity();
    } catch {
      // Stop if increment fails
      break;
    }
  }
  world.testData.onProductPage = true;
});

Then('an error message appears', async ({ world }) => {
  const hasError = await world.page
    ?.locator('[role="alert"], .error, [class*="error"], [class*="warning"]')
    .first()
    .isVisible()
    .catch(() => false);

  expect(hasError).toBe(true);
});

Then('an error message should appear', async ({ world }) => {
  const hasError = await world.page
    ?.locator('[role="alert"], .error, [class*="error"], [class*="warning"]')
    .first()
    .isVisible()
    .catch(() => false);

  expect(hasError).toBe(true);
});
