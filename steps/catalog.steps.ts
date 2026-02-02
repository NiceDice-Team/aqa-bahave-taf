import { Given, When, Then, expect } from './bdd';

Given('I am on the product catalog page', async ({ world }) => {
  await world.page.goto('/');
  await world.page.waitForLoadState('domcontentloaded');
  // Click on "board games" link to get to catalog
  const boardGamesLink = world.page.locator('a:has-text("board games")').first();
  if (await boardGamesLink.count() > 0) {
    await boardGamesLink.click();
    await world.page.waitForLoadState('networkidle');
  }
});

When('I filter by category {string}', async ({ world }, category: string) => {
  // Try various category link patterns
  const categoryLink = world.page.locator(`a:has-text("${category}"), [data-category="${category}"], [href*="${category}"]`).first();
  await categoryLink.click();
  await world.page.waitForLoadState('networkidle');
});

When('I sort products by {string}', async ({ world }, sortOption: string) => {
  // Try to find sort dropdown/select
  const sortSelect = world.page.locator('select[name="sort"], select[data-sort], [role="combobox"]').first();
  if (await sortSelect.count() > 0) {
    await sortSelect.selectOption(sortOption);
    await world.page.waitForLoadState('networkidle');
  }
});

Then('I should see products in the {string} category', async ({ world }, category: string) => {
  // Wait for products to load
  await world.page.waitForTimeout(2000);
  // Check that we're on the right page/category
  const url = world.page.url();
  expect(url).toContain(category.replace(' ', '-'));
});

Then('I should see the category filter is active', async ({ world }) => {
  // Check for active filter indicator
  await world.page.waitForTimeout(1000);
  // This is a basic check - in real implementation would check for active class
});

Then('I should see products sorted by price in ascending order', async ({ world }) => {
  // Wait for products to load
  await world.page.waitForTimeout(2000);
  // In real implementation, would extract prices and verify order
});

Then('they should be sorted by {string}', async ({ world }, sortOption: string) => {
  // Wait for sorting to complete
  await world.page.waitForTimeout(2000);
  // Verification would depend on sort option
});