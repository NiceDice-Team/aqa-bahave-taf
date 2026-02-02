# Test Structure

## Overview

The test suite is organized into distinct approaches, each serving different testing needs:

```
aqa-bahave-taf/
├── features/         # Gherkin feature files (BDD)
│   ├── cart/
│   ├── catalog/
│   ├── checkout/
│   └── users/
├── steps/            # Step definitions (playwright-bdd)
│   ├── cart.steps.ts
│   ├── catalog.steps.ts
│   ├── hooks.ts
│   ├── login.steps.ts
│   └── registration.steps.ts
├── support/          # Support code and hooks
│   └── world.ts
├── page-objects/     # Page Object Models (used by BDD)
│   ├── base-page.ts
│   ├── cart-page.ts
│   ├── catalog-page.ts
│   ├── components/
│   ├── home-page.ts
│   ├── login-page.ts
│   ├── product-page.ts
│   ├── profile-page.ts
│   └── register-page.ts
├── adapters/         # API and web adapters
├── sdk/              # API SDKs
├── helpers/          # Helper utilities
├── interfaces/       # TypeScript interfaces
├── constants/        # Constants (endpoints, errors)
├── utils/            # Utility functions
├── reports/          # Test reports (HTML, JSON)
├── package.json      # Project config
├── tsconfig.json     # TypeScript config
├── tsconfig.cucumber.json # Cucumber/TS config
└── README.md         # This file
```

## Testing Approaches


### BDD Tests
- Uses playwright-bdd (Playwright + Gherkin)
- Business-readable specifications
- Good for acceptance testing and documentation
- Runs with Playwright Test runner
- Example: `features/checkout/checkout.feature`


### End-to-End Tests
*Not present in this repo. All E2E and BDD are unified under playwright-bdd with page objects.*


### Page Object Models
- Shared UI abstractions in `page-objects/`
- Used by all BDD step definitions
- Reduces duplication
- Example: `page-objects/cart-page.ts`


### Unit Tests
*Not present in this repo. All tests are integration/BDD style.*

## Best Practices

1. **Code Sharing**
   - Share page objects between BDD and E2E tests
   - Keep test data in appropriate /fixtures folders
   - Use lib/ for cross-cutting concerns

2. **Page Objects**
   - One class per page/major component
   - Export from `poms/pages/index.ts`
   - Use with both BDD steps and E2E tests

3. **Test Organization**
   - BDD: One .feature per major user journey
   - E2E: One .spec.ts per page/feature
   - Unit: One .test.tsx alongside component


4. **Running Tests**
```bash
# Run all BDD (playwright-bdd) tests
npm run test:e2e

# CI mode
npm run test:e2e:ci
```

## Examples


### Page Object Example (used by BDD)
```typescript
// page-objects/cart-page.ts
export class CartPage {
  constructor(public page: Page) {}
  async addToCart(productId: string) {
    await this.page.click(`[data-testid="add-to-cart-${productId}"]`);
  }
}
```

### BDD Step using Page Object (playwright-bdd)
```typescript
// steps/cart.steps.ts
import { When } from '@cucumber/cucumber';
import { CartPage } from '../page-objects/cart-page';

When('I add {string} to cart', async function({ page }, productId: string) {
  const cart = new CartPage(page);
  await cart.addToCart(productId);
});
```
