# Smoke Test Execution Summary

**Date:** 2024 (Latest Run)  
**Environment:** Staging (https://bgshop.work.gd/api)  
**Frontend:** https://team-challange-front-lhrg.vercel.app  
**Browser:** Chromium (Headed Mode)  
**Test Framework:** Playwright BDD  
**Total Workers:** 5  
**Test Timeout:** 60 seconds per test

---

## 📊 Test Results

| Metric             | Count       |
| ------------------ | ----------- |
| **Total Tests**    | 24          |
| **Passed**         | 9 (37.5%)   |
| **Failed**         | 15 (62.5%)  |
| **Execution Time** | 4.2 minutes |

---

## ✅ Passed Tests (9)

1. ✓ Product page loads without errors (7.0s)
2. ✓ Product details loaded (7.9s)
3. ✓ Main product image is displayed (8.0s)
4. ✓ Product quantity increases the counter (6.0s)
5. ✓ Below minimum keeps quantity at 1 (5.0s)
6. ✓ Add to Cart shows a confirmation (4.1s)
7. ✓ Reviews display reviewer name, text, and stars (4.0s)
8. ✓ Newsletter email field accepts input (4.8s)
9. ✓ Successful registration (6.6s)

---

## ❌ Failed Tests (15)

### By Feature

#### Shopping Cart (4 failures)

1. **Adding a product to cart** - Strict mode violation: "Add to Cart" button resolves to 12 elements
2. **Removing a product from cart** - Test timeout (60s exceeded)
3. **Add product to cart successfully** - Strict mode violation: "Add to Cart" button resolves to 12 elements
4. **Remove product from cart** - Locator timeout (15s exceeded)

#### Product Catalog (2 failures)

5. **Filter products by category** - Category filters not visible (15s timeout)
6. **Sort products by price** - Sort dropdown not visible (15s timeout)

#### Checkout (5 failures)

7. **Successful checkout with shipping and payment** - Payment method selector timeout (15s)
8. **Place an order successfully** - Payment method selector timeout (15s)
9. **View own orders** - API returns 0 orders instead of expected >= 3
10. **Pay with LiqPay** - Payment method selector timeout (15s)
11. **Pay with credit card** - Payment method selector timeout (15s)

#### Product Details (2 failures)

12. **Three required accordion tabs are present** - Accordion tab assertion failed
13. **Review count and average rating are visible** - Review count assertion failed
14. **Product appears in cart after Add to Cart** - Product not found in cart assertion failed

#### User Authentication (1 failure)

15. **User Login** - Authentication check returned false (user not authenticated)

---

## 🔴 Critical Issues

### High Priority (Blocking Core Functionality)

- **Authentication Broken**: Login not persisting user session
- **Cart Operations Fragile**: Multiple selector issues preventing product addition/removal
- **Checkout Unavailable**: Payment method selectors timing out

### Medium Priority

- **Catalog Filtering**: Category and sort UI elements not loading
- **Order API**: No orders returned from API (data or permissions issue)
- **Accordion/Review Elements**: Missing or incorrectly targeted selectors

---

## 📈 Failure Categories

| Category                | Count | Type                |
| ----------------------- | ----- | ------------------- |
| Selector/Locator Issues | 11    | TAF Implementation  |
| Timeouts                | 2     | TAF/App Performance |
| Assertion Failures      | 1     | TAF/Test Logic      |
| API Issues              | 1     | Application Bug     |

---

## 🛠️ Recommendations

### Immediate Actions

1. Fix "Add to Cart" button selector (use `.first()` or more specific locator)
2. Investigate payment method selector visibility issues
3. Debug user authentication (check token/session handling)
4. Verify category filter and sort dropdown selectors

### Short-term

1. Add explicit waits for dynamic elements
2. Implement better error handling in page objects
3. Review catalog page element loading
4. Add debugging screenshots for timeout scenarios

### Long-term

1. Implement visual regression testing for UI consistency
2. Add API contract validation for order retrieval
3. Refactor selectors to be more maintainable
4. Consider using data-testid attributes instead of role/text matching

---

## 📋 Test User & Data

**Test User:** tchallengevasyalex+1@gmail.com  
**Environment Config Loaded:** ✅  
**Browser Mode:** Headed (chromium, headless: false)  
**Video & Trace Recordings:** Available in test-results/ directory

---

## 🔗 Test Artifacts

- **HTML Report:** `playwright-report/index.html`
- **Test Results:** `test-results/` directory
- **Traces:** Available for each failed test (`.zip` format)
- **Screenshots:** Available for each failed test (`.png` format)
- **Videos:** Available for each failed test (`.webm` format)

---

## 📝 Next Steps

See `SMOKE-TEST-BUGS.md` for categorized application bugs  
See `SMOKE-TEST-IMPROVEMENTS.md` for TAF implementation improvements
