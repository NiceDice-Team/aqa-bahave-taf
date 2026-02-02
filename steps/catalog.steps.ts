import { Given, When, Then } from 'playwright-bdd';
import { CustomWorld } from './hooks';
import { ProductCatalogAdapter } from '../adapters/ProductCatalogAdapter';

Given('I am on the product catalog page', async function(this: CustomWorld) {
  const catalog = new ProductCatalogAdapter(this.page);
  await catalog.goto('/catalog');
  await catalog.waitForReady();
});

When('I filter by category {string}', async function(this: CustomWorld, category: string) {
  const catalog = new ProductCatalogAdapter(this.page);
  await catalog.filterByCategory(category);
});

When('I sort products by {string}', async function(this: CustomWorld, sortOption: string) {
  const catalog = new ProductCatalogAdapter(this.page);
  await catalog.sortBy(sortOption);
});

Then('I should see the product grid', async function(this: CustomWorld) {
  const catalog = new ProductCatalogAdapter(this.page);
  // Implementation will depend on your ProductCatalogAdapter methods
});