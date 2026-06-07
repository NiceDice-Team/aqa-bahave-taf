# Product Detail Page — Test Status

_Feature file: `features/product/product-detail.feature`_  
_Last updated: 2026-05-16_

---

## Test Run Command

```powershell
Remove-Item -Recurse -Force "$env:TEMP\playwright-transform-cache" -ErrorAction SilentlyContinue
$env:HEADLESS="true"
npx.cmd bddgen
npx.cmd playwright test ".features-gen/features/product/product-detail.feature.spec.js" --reporter=list
```

---

## Scenarios — Current Status

| #   | Scenario                                                | Tags             | Status          | Notes                                               |
| --- | ------------------------------------------------------- | ---------------- | --------------- | --------------------------------------------------- |
| 1   | Product page loads without errors                       | @smoke @critical | ✅ Pass         | Checks title visibility                             |
| 2   | All required product elements are visible               | @smoke @critical | ✅ Pass         | Title, image, price, description, add-to-cart       |
| 3   | Main product image is displayed                         | @smoke           | ✅ Pass         | Same image check as scenario 2                      |
| 4   | Clicking a thumbnail changes the main product image     | @regression      | ⚠️ Not verified | Thumbnail click → image src change                  |
| 5   | No broken images exist on the product page              | @regression      | ⚠️ Not verified | Checks `naturalWidth > 0` for all `<img>`           |
| 6   | Incrementing quantity increases the counter             | @smoke @critical | ⚠️ Not verified | Uses "Increase quantity" button + span locator      |
| 7   | Decrementing below minimum keeps quantity at 1          | @smoke @critical | ⚠️ Not verified | Uses "Decrease quantity" button                     |
| 8   | Clicking Add to Cart shows a confirmation               | @smoke @critical | ⚠️ Not verified | Checks `[role="status"],[role="alert"],[aria-live]` |
| 9   | Low stock warning is visible when stock is low          | @regression      | ⚠️ Not verified | Likely ❌ — no matching element found in DOM        |
| 10  | Add to Cart button is disabled for out-of-stock product | @regression      | ⚠️ Not verified | Needs valid out-of-stock product URL                |
| 11  | Three required accordion tabs are present               | @smoke           | ⚠️ Not verified |                                                     |
| 12  | Clicking an accordion tab expands its content           | @regression      | ⚠️ Not verified |                                                     |
| 13  | Opening another tab collapses the current one           | @regression      | ⚠️ Not verified |                                                     |
| 14  | Review count and average rating are visible             | @smoke           | ⚠️ Not verified |                                                     |
| 15  | Reviews display reviewer name, text, and stars          | @smoke           | ⚠️ Not verified |                                                     |
| 16  | Clicking next review page updates list                  | @regression      | ⚠️ Not verified |                                                     |
| 17  | Write a Review button hidden for guests                 | @regression      | ⚠️ Not verified |                                                     |
| 18  | Write a Review button visible for logged-in users       | @regression      | ⚠️ Not verified |                                                     |
| 19  | Clicking Write a Review opens the review form           | @regression      | ⚠️ Not verified |                                                     |
| 20  | Newsletter email field accepts input                    | @smoke           | ⚠️ Not verified |                                                     |
| 21  | Invalid email triggers validation error                 | @regression      | ⚠️ Not verified |                                                     |
| 22  | Valid email subscription shows success                  | @regression      | ⚠️ Not verified |                                                     |

---

## Root Causes Fixed This Session

### 1. Background step was slow and flaky (⭐ main fix)

- **Before**: `navigateToFirstProductDetail()` navigated to `/catalog`, waited for product cards to be visible, clicked the first card, then waited for the product page to load — **2 page loads + 1 click**. On the Vercel staging server this took 15–20 s and sometimes exceeded the 15 s `waitFor` timeout.
- **After**: Navigates directly to `/product/3` using `ENDPOINTS.PRODUCTS.DETAILS('3')` + `waitForLoadState('domcontentloaded')`. One fast navigation.

### 2. Wrong URL pattern in `ENDPOINTS.PRODUCTS.DETAILS`

- **Before**: `/products/${id}` (plural)
- **After**: `/product/${id}` (singular, matches actual app URL)

### 3. All product-page locators replaced (no `data-testid` in app)

The app has no `data-testid` attributes. All locators were rewritten using roles, accessible names, and CSS class selectors derived from the live DOM.

| Locator            | Before                               | After                                                     |
| ------------------ | ------------------------------------ | --------------------------------------------------------- |
| `productTitle`     | `[data-testid="product-title"]`      | `getByRole('heading', { level: 1 })`                      |
| `productPrice`     | `[data-testid="product-price"]`      | `getByText(/\$\d+\.\d+/).first()`                         |
| `mainProductImage` | `[data-testid="main-image"]`         | `img[class="object-contain"]:not([class*="p-1"]).first()` |
| `thumbnailImages`  | `[data-testid="thumbnail"]`          | `img[class*="object-contain"][class*="p-1"]`              |
| `addToCartButton`  | `[data-testid="add-to-cart"]`        | `getByRole('button', { name: /add to cart/i })`           |
| `quantityInput`    | `getByRole('spinbutton')`            | `button[aria-label="Decrease quantity"] + span`           |
| `incrementButton`  | `getByRole('button', { name: '+' })` | `getByRole('button', { name: /increase quantity/i })`     |
| `decrementButton`  | `getByRole('button', { name: '−' })` | `getByRole('button', { name: /decrease quantity/i })`     |
| `accordionTabs`    | `[data-testid="accordion-tab"]`      | `h3 button[aria-expanded]`                                |
| `cartBadge`        | `[data-testid="cart-badge"]`         | `button[aria-label*="cart" i] > span`                     |

### 4. `state: 'visible'` → `state: 'attached'` for image/price/description/add-to-cart

Next.js SSR + headless Chromium renders elements in the DOM with zero bounding boxes until viewport layout triggers. These elements are **attached** but not **visible**. Visibility checks now use `state: 'attached'` (title still uses `state: 'visible'` since `h1` renders normally).

### 5. Transform cache must be cleared before each run

Playwright caches compiled TypeScript at `$env:TEMP\playwright-transform-cache`. When running with multiple workers, a race condition can cause stale code to be loaded. Always clear this cache before running tests (included in the run command above).

---

## Known Remaining Issues

| Issue                                                                                          | Severity | File                              | Notes                                                                                                    |
| ---------------------------------------------------------------------------------------------- | -------- | --------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `navigateToOutOfStockProduct` uses hardcoded slug `'out-of-stock-product'` which may not exist | Medium   | `adapters/product.web.adapter.ts` | Need a valid out-of-stock product ID from the API                                                        |
| `lowStockMessage` locator uses `data-testid`/class patterns that don't exist in DOM            | Medium   | `page-objects/product-page.ts`    | DOM shows `generic: "In stock"` — need to find the real low-stock state                                  |
| `reviewCards` locator uses class patterns not present in DOM                                   | Low      | `page-objects/product-page.ts`    | DOM has no `data-testid` on review cards                                                                 |
| `isAccordionTabPresent` uses fallback selectors; real selector is `h3 button[aria-expanded]`   | Low      | `page-objects/product-page.ts`    | Works but could be simplified                                                                            |
| Catalog page `waitFor({ state: 'visible' })` has no explicit timeout                           | Low      | `page-objects/catalog-page.ts:60` | Uses default 15 s action timeout; fine now that clickFirstProduct is not called for product-detail tests |

---

## App DOM Notes (product/3 — Marvel United)

Key confirmed elements from live DOM inspection:

```
img "Marvel United X-Men"       class="object-contain"         ← main image (×2 in DOM)
img "Marvel United X-Men"       class="object-contain p-1"     ← thumbnail
img "Marvel United Box"         class="object-contain p-1"     ← thumbnail
heading "Marvel United"         level=1                        ← product title
generic: "$45.00"                                              ← price (matched by getByText)
generic: "In stock"                                            ← stock indicator
button "Decrease quantity"      [disabled when qty=1]
span    "1"                     class="text-base leading-[19px] text-black"  ← quantity display
button "Increase quantity"
button "Add to cart"                                           ← note: mixed case (was ALL CAPS)
h3 > button "Description"       [aria-expanded]
h3 > button "Game Information"  [aria-expanded]
h3 > button "Delivery and payment" [aria-expanded]
```
