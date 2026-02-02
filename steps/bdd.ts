import { test as base } from 'playwright-bdd';
import { createBdd } from 'playwright-bdd';
import { CustomWorld, customWorldFixture } from '../support/world';

// Extend test with CustomWorld fixture
export const test = base.extend<{ world: CustomWorld }>({
  world: customWorldFixture,
});

// Create BDD helpers - Playwright style (fixtures passed as parameters)
export const { Given, When, Then, Before, After } = createBdd(test);
