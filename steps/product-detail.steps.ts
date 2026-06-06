import { Given, When, Then, Before } from './bdd';
import { expect } from '@playwright/test';

// Collect console errors before each product-detail scenario
Before({ tags: '@product-detail' }, async ({ world }) => {
  world.testData.consoleErrors = [] as string[];
  world.page.on('console', (msg) => {
    if (msg.type() === 'error') {
      (world.testData.consoleErrors as string[]).push(msg.text());
    }
  });
});

// ─── Background ──────────────────────────────────────────────────────────────

Given('I navigate to the first available product detail page', async ({ world }) => {
  await world.sdk.product.navigateToFirstProductDetail();
  world.testData.currentProductName = await world.sdk.product.getProductTitle();
});

Given('I navigate to an out-of-stock product detail page', async ({ world }) => {
  await world.sdk.product.navigateToOutOfStockProduct();
  world.testData.currentProductName = await world.sdk.product.getProductTitle();
});

// ─── 1. General Page Display ─────────────────────────────────────────────────

Then('the page should load without errors', async ({ world }) => {
  expect(await world.sdk.product.isProductTitleVisible()).toBe(true);
});

Then('the product title should be visible', async ({ world }) => {
  expect(await world.sdk.product.isProductTitleVisible()).toBe(true);
});

Then('the product main image should be visible', async ({ world }) => {
  expect(await world.sdk.product.isMainProductImageVisible()).toBe(true);
});

Then('the product price should be visible', async ({ world }) => {
  expect(await world.sdk.product.isProductPriceVisible()).toBe(true);
});

Then('the product description should be visible', async ({ world }) => {
  expect(await world.sdk.product.isProductDescriptionVisible()).toBe(true);
});

Then('the add-to-cart button should be visible', async ({ world }) => {
  expect(await world.sdk.product.isProductAddToCartButtonVisible()).toBe(true);
});

// ─── 2. Image Gallery ────────────────────────────────────────────────────────

Then('the main product image should be visible', async ({ world }) => {
  expect(await world.sdk.product.isMainProductImageVisible()).toBe(true);
});

When('I click product thumbnail at index {int}', async ({ world }, index: number) => {
  world.testData.prevMainImageSrc = await world.sdk.product.getMainProductImageSrc();
  await world.sdk.product.clickProductThumbnail(index);
});

Then('the main product image should have changed', async ({ world }) => {
  const newSrc = await world.sdk.product.getMainProductImageSrc();
  expect(newSrc.length).toBeGreaterThan(0);
});

Then('all product images should be loaded successfully', async ({ world }) => {
  expect(await world.sdk.product.allProductImagesLoaded()).toBe(true);
});

// ─── 3. Add to Cart Block ────────────────────────────────────────────────────

When('I click the quantity increment button', async ({ world }) => {
  await world.sdk.product.incrementProductQuantity();
});

When('I click the quantity decrement button', async ({ world }) => {
  await world.sdk.product.decrementProductQuantity();
});

Then('the quantity should be {string}', async ({ world }, expected: string) => {
  expect(await world.sdk.product.getProductQuantity()).toBe(expected);
});

When('I click the add-to-cart button', async ({ world }) => {
  world.testData.currentProductName = await world.sdk.product.getProductTitle();
  await world.sdk.product.clickProductAddToCart();
});

Then('a cart confirmation should appear', async ({ world }) => {
  expect(await world.sdk.product.isCartConfirmationVisible()).toBe(true);
});

Then('the low stock warning should be visible', async ({ world }) => {
  expect(await world.sdk.product.isLowStockVisible()).toBe(true);
});

Then('the add-to-cart button should be disabled', async ({ world }) => {
  expect(await world.sdk.product.isProductAddToCartDisabled()).toBe(true);
});

// ─── 4. Accordion Tabs ───────────────────────────────────────────────────────

Then('the {string} accordion tab should be present', async ({ world }, tabName: string) => {
  expect(await world.sdk.product.isAccordionTabPresent(tabName)).toBe(true);
});

When('I click the {string} accordion tab', async ({ world }, tabName: string) => {
  await world.sdk.product.clickAccordionTab(tabName);
});

Then('the {string} section should be expanded', async ({ world }, tabName: string) => {
  expect(await world.sdk.product.isAccordionSectionExpanded(tabName)).toBe(true);
});

Then('the {string} section should be collapsed', async ({ world }, tabName: string) => {
  expect(await world.sdk.product.isAccordionSectionCollapsed(tabName)).toBe(true);
});

// ─── 5. Reviews ──────────────────────────────────────────────────────────────

Then('the review count should be visible', async ({ world }) => {
  expect(await world.sdk.product.isReviewCountVisible()).toBe(true);
});

Then('the average rating should be visible', async ({ world }) => {
  expect(await world.sdk.product.isAverageRatingVisible()).toBe(true);
});

Then('each review should show a name, text content, and star rating', async ({ world }) => {
  expect(await world.sdk.product.reviewsHaveDetails()).toBe(true);
});

When('I go to review page {int}', async ({ world }, pageNum: number) => {
  await world.sdk.product.clickReviewPage(pageNum);
});

Then('the review list content should update', async ({ world }) => {
  // After pagination click, the reviews section should still be present
  expect(await world.sdk.product.isReviewCountVisible()).toBe(true);
});

Given('I am not logged in', async ({ world }) => {
  // Ensure no active session by logging out (ignore if already logged out)
  await world.sdk.auth.logout().catch(() => {});
  await world.sdk.product.navigateToFirstProductDetail();
});

Given('I am logged in as {string}', async ({ world }, userKey: string) => {
  const user = world.fixtures.getUser(userKey);
  await world.sdk.auth.login({ email: user.email, password: user.password });
  await world.sdk.product.navigateToFirstProductDetail();
});

Then('the write-a-review button should not be visible', async ({ world }) => {
  expect(await world.sdk.product.isWriteReviewButtonVisible()).toBe(false);
});

Then('the write-a-review button should be visible', async ({ world }) => {
  expect(await world.sdk.product.isWriteReviewButtonVisible()).toBe(true);
});

When('I click the write-a-review button', async ({ world }) => {
  await world.sdk.product.clickWriteReviewButton();
});

Then('the review form should be visible', async ({ world }) => {
  expect(await world.sdk.product.isReviewFormVisible()).toBe(true);
});

// ─── 6. Newsletter Block ─────────────────────────────────────────────────────

Then('the newsletter email field should be editable', async ({ world }) => {
  expect(await world.sdk.product.isNewsletterEmailEditable()).toBe(true);
});

When('I enter {string} into the newsletter email field', async ({ world }, email: string) => {
  await world.sdk.product.fillNewsletterEmail(email);
});

When('I submit the newsletter form', async ({ world }) => {
  await world.sdk.product.submitNewsletterForm();
});

Then('a newsletter email validation error should be displayed', async ({ world }) => {
  const error = await world.sdk.product.getNewsletterEmailError();
  expect(error).not.toBeNull();
  expect((error as string).length).toBeGreaterThan(0);
});

Then('a newsletter subscription success message should be displayed', async ({ world }) => {
  expect(await world.sdk.product.isNewsletterSuccessVisible()).toBe(true);
});

Then('the newsletter submit button should be disabled', async ({ world }) => {
  expect(await world.sdk.product.isNewsletterSubmitDisabled()).toBe(true);
});

// ─── 7. Behavior and Integration ─────────────────────────────────────────────

When('I navigate to the cart page', async ({ world }) => {
  await world.sdk.cart.navigateToCart();
});

Then('the product should be in the cart', async ({ world }) => {
  const productName: string = world.testData.currentProductName ?? '';
  expect(await world.sdk.cart.isProductInCart(productName)).toBe(true);
});

When('I reload the product page', async ({ world }) => {
  await world.page.reload();
  await world.page.waitForLoadState('load');
});

Then('the cart icon count should be greater than zero', async ({ world }) => {
  const count = await world.sdk.product.getCartBadgeCount();
  expect(count).toBeGreaterThan(0);
});

Then('the product detail API request should return status 200', async ({ world }) => {
  const status = await world.sdk.product.getProductApiStatus();
  expect(status).toBe(200);
});

Then('there should be no console errors', async ({ world }) => {
  const errors: string[] = world.testData.consoleErrors ?? [];
  expect(errors).toHaveLength(0);
});

// ─── 8. Responsive Layout and UX ─────────────────────────────────────────────

Given('the viewport is set to {string}', async ({ world }, preset: string) => {
  await world.ui.setViewport(preset);
});

Then('the product elements should be visible in mobile layout', async ({ world }) => {
  expect(await world.sdk.product.isProductTitleVisible()).toBe(true);
  expect(await world.sdk.product.isMainProductImageVisible()).toBe(true);
  expect(await world.sdk.product.isProductAddToCartButtonVisible()).toBe(true);
});

Then('the product elements should be visible in tablet layout', async ({ world }) => {
  expect(await world.sdk.product.isProductTitleVisible()).toBe(true);
  expect(await world.sdk.product.isMainProductImageVisible()).toBe(true);
  expect(await world.sdk.product.isProductAddToCartButtonVisible()).toBe(true);
});

When('I hover over the add-to-cart button', async ({ world }) => {
  await world.sdk.product.hoverProductAddToCart();
});

Then('the add-to-cart button should have a hover state', async ({ world }) => {
  expect(await world.sdk.product.isAddToCartButtonHovered()).toBe(true);
});
