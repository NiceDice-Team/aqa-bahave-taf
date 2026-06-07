import { Given, When, Then } from './bdd';
import { expect } from '@playwright/test';

Given('I am on the product catalog page', async ({ world }) => {
  await world.sdk.product.navigateToCatalog();
});

When('I filter by category {string}', async ({ world }, category: string) => {
  await world.sdk.product.filterByCategory(category);
});

When('I sort products by {string}', async ({ world }, sortOption: string) => {
  await world.sdk.product.sortBy(sortOption);
});

Then('I should see products in the {string} category', async ({ world }, category: string) => {
  const active = await world.sdk.product.getActiveCategoryName();
  expect(active.toLowerCase()).toContain(category.toLowerCase());
});

Then('I should see the category filter is active', async ({ world }) => {
  const active = await world.sdk.product.getActiveCategoryName();
  expect(active.length).toBeGreaterThan(0);
});

Then('I should see products sorted by price in ascending order', async ({ world }) => {
  expect(await world.sdk.product.isSortedByPriceAscending()).toBe(true);
});

Then('they should be sorted by {string}', async ({ world }, sortOption: string) => {
  if (sortOption.toLowerCase().includes('asc')) {
    expect(await world.sdk.product.isSortedByPriceAscending()).toBe(true);
  } else if (sortOption.toLowerCase().includes('desc')) {
    expect(await world.sdk.product.isSortedByPriceDescending()).toBe(true);
  }
});
