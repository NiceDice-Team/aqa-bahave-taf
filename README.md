# Board Game Shop — Automated QA Test Suite

BDD test automation framework for the **Board Game Shop** application built with TypeScript, Playwright, and playwright-bdd.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Running Tests](#running-tests)
- [Generating API Endpoints](#generating-api-endpoints)
- [Playwright MCP (AI Agent)](#playwright-mcp-ai-agent)
- [Docker Setup](#docker-setup)
- [Writing Tests](#writing-tests)
- [CI/CD Integration](#cicd-integration)

## Prerequisites

- **Node.js** 24+
- **npm** 10+
- **Git**
- **Docker** + Docker Compose (optional, for containerised runs)

## Installation

```bash
git clone <repository-url>
cd aqa-bahave-taf
npm install
npx playwright install chromium
```

## Configuration

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description | Example |
|---|---|---|
| `API_BASE_URL` | Backend API base URL | `https://bgshop.work.gd` |
| `FRONTEND_BASE_URL` | Frontend base URL | `https://team-challange-front.vercel.app` |
| `TEST_USER_EMAIL` | Test account email | `user@example.com` |
| `TEST_USER_PASSWORD` | Test account password | `secret123` |
| `HEADLESS` | Run browser headless | `true` / `false` |
| `SLOW_MO` | Slow down actions (ms) | `0` |

## Project Structure

```
aqa-bahave-taf/
├── features/              # Gherkin feature files
│   ├── cart/
│   ├── catalog/
│   ├── checkout/
│   └── users/
├── steps/                 # BDD step definitions
├── support/               # World, fixtures, hooks
├── sdk/                   # Domain façade (auth, cart, product, checkout)
├── adapters/              # Web & API adapter implementations
├── page-objects/          # Locators & UI actions per page
│   └── components/        # Reusable UI components
├── interfaces/            # TypeScript contracts per domain
├── constants/
│   ├── endpoints.ts       # Frontend route constants
│   └── api-endpoints.ts   # AUTO-GENERATED API endpoints (from OpenAPI)
├── config/                # Environment configuration
├── scripts/
│   └── generate-endpoints.ts  # OpenAPI → TypeScript generator
├── helpers/               # Email, auth helpers
├── fixtures/              # Static test data (users.json)
├── utils/                 # Utility functions
├── .vscode/
│   └── mcp.json           # Playwright MCP server for VS Code Copilot
├── Dockerfile
├── docker-compose.yml
└── playwright.config.ts
```

## Architecture

The framework enforces strict layering to keep tests readable and maintainable:

```
Steps → SDK → Adapter → PageObject → Component
```

| Layer | Location | Responsibility |
|---|---|---|
| **Steps** | `steps/*.ts` | BDD glue only — calls SDK, asserts with `expect` |
| **SDK** | `sdk/*.ts` | Domain façade — delegates to adapter |
| **Adapter** | `adapters/*.ts` | UI (Playwright) or API (`page.request`) calls |
| **PageObject** | `page-objects/*.ts` | Locators and actions for one page |
| **Component** | `page-objects/components/*.ts` | Reusable UI building blocks |

**Rules:**
- Steps must NOT use raw Playwright API (`page.locator`, `page.click`, etc.)
- Adapters must NOT contain locator strings — delegate to PageObjects
- PageObjects and Components are the ONLY place where `page.locator()` is used

## Running Tests

```bash
# Generate test files from feature files (required before first run)
npm run test:generate

# Run all tests
npm run test:run

# Run smoke suite only (@smoke tag)
npm run test:smoke

# Run regression suite only (@regression tag)
npm run test:regression

# Run by domain
npm run test:users
npm run test:cart
npm run test:catalog
npm run test:checkout

# Headed browser (visible)
npm run test:headed

# Debug mode (slowMo + Playwright inspector)
npm run test:debug

# Playwright UI mode
npm run test:ui

# Open HTML report
npm run report:open
```

### Smoke Test Scenarios (13 total)

| Tag | Scenario |
|---|---|
| `@cart @smoke @api` | Adding / removing a product to cart |
| `@cart @smoke @ui` | Add / remove product from cart UI |
| `@catalog @smoke` | Filter by category, sort by price |
| `@checkout @smoke @ui` | Successful checkout with payment |
| `@orders @smoke @ui` | Place an order successfully |
| `@orders @smoke @api` | View own orders via API |
| `@payments @smoke @api` | Pay with LiqPay / credit card |
| `@login @smoke @ui` | Successful login |
| `@registration @smoke @ui` | Successful registration |

## Generating API Endpoints

The `constants/api-endpoints.ts` file is auto-generated from the live OpenAPI schema at `API_BASE_URL/api/schema/`.

```bash
npm run generate:endpoints
```

This fetches all 46 real API paths, groups them by tag, and writes typed constants:

```typescript
// constants/api-endpoints.ts (auto-generated — do not edit manually)
export const API_ENDPOINTS = {
  // USERS
  POST_API_USERS_TOKEN: '/api/users/token/',
  POST_API_USERS_REGISTER: '/api/users/register/',
  POST_API_USERS_FORGOT_PASSWORD: '/api/users/forgot-password/',
  // CART
  GET_API_CART: '/api/cart/',
  POST_API_CART_ITEM: '/api/cart/item/',
  // ORDERS
  GET_API_ORDERS: '/api/orders/',
  POST_API_ORDERS_START: '/api/orders/start/',
  // PRODUCTS
  GET_API_PRODUCTS: '/api/products/',
  GET_API_PRODUCTS_ID: (id: string | number) => `/api/products/${id}/`,
  // ...
};
```

Re-run `npm run generate:endpoints` whenever the backend schema changes.

## Playwright MCP (AI Agent)

The `.vscode/mcp.json` registers the **Playwright MCP server** so VS Code Copilot agent mode can control a real browser:

```json
{
  "servers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--browser", "chromium", "--caps", "vision"]
    }
  }
}
```

To use it: open VS Code Chat (`Ctrl+Alt+I`), switch to **Agent mode**, and ask Copilot to inspect the live app, verify locators, or explore UI flows before implementing step definitions.

## Docker Setup

```bash
# Build and run tests in Docker
npm run docker:test

# Or with docker-compose directly
docker-compose run --rm playwright-tests npm run test:smoke
```

## Writing Tests

### Adding a new scenario

1. Add the scenario to the relevant `.feature` file with appropriate tags
2. Add the method signature to `interfaces/*.ts`
3. Implement the action in the PageObject/Component
4. Implement the method in the WebAdapter (calling the PageObject)
5. Add the API stub in the ApiAdapter
6. Delegate in the SDK
7. Add the step definition calling `world.sdk.xxx.method()`

### Step definition example

```typescript
// steps/cart.steps.ts
When('I add product {string} to cart', async ({ world }, productId: string) => {
  await world.sdk.cart.addToCart(productId, 1);
});
```

## CI/CD Integration

Set these environment variables in your CI pipeline:

```
API_BASE_URL=https://bgshop.work.gd
FRONTEND_BASE_URL=https://team-challange-front.vercel.app
TEST_USER_EMAIL=<ci-test-user>
TEST_USER_PASSWORD=<ci-test-password>
HEADLESS=true
CI=true
```

The config automatically sets `retries: 2` and uses `workers` from `PARALLEL_WORKERS` when `CI=true`.
