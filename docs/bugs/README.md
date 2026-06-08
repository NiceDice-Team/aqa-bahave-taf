# Bug Tracking Documentation

This directory contains documented bugs discovered during automated testing and manual QA.

## Directory Structure

```
docs/bugs/
├── README.md (this file)
├── BUG_TEMPLATE.md (template for new bug reports)
├── BUG-260608-001.md (individual bug reports)
├── BUG-260608-002.md
└── ...
```

## How to Report a Bug

1. **Copy the template:**
   ```bash
   cp docs/bugs/BUG_TEMPLATE.md docs/bugs/BUG-YYMMDD-NNN.md
   ```

2. **Fill in the template** with all relevant details

3. **Add appropriate tags:**
   - `#bug` - Always include
   - `#api` - For API bugs
   - `#fe` - For Frontend bugs
   - Severity: `#critical`, `#major`, `#minor`, `#trivial`
   - Feature: `#cart`, `#checkout`, `#auth`, `#product`, etc.

4. **Commit and track:**
   ```bash
   git add docs/bugs/BUG-YYMMDD-NNN.md
   git commit -m "docs(bugs): #bug #api #critical - [bug title]"
   ```

## Tag System

### By Type
- `#api` - Backend/API issues
- `#fe` - Frontend issues
- `#bug` - Always include on bug reports

### By Severity
- `#critical` - System broken, complete feature failure
- `#major` - Feature partially broken, impacts core functionality
- `#minor` - Feature works but with glitches
- `#trivial` - Cosmetic or non-functional issue

### By Feature
- `#auth` - Authentication/Login/Registration
- `#cart` - Shopping cart functionality
- `#checkout` - Checkout flow
- `#product` - Product catalog and details
- `#payment` - Payment processing
- `#ui` - UI/UX issues

## Bug ID Format

`BUG-YYMMDD-NNN`
- `YY` - Year (26 = 2026)
- `MM` - Month (01-12)
- `DD` - Day (01-31)
- `NNN` - Sequential number for that day (001, 002, etc.)

**Example:** `BUG-260608-001` (First bug reported on June 8, 2026)

## Bug Status Workflow

```
open → in-progress → resolved (or wontfix)
```

### Status Definitions
- **open** - Bug confirmed, not yet assigned or started
- **in-progress** - Developer actively working on the fix
- **resolved** - Bug fixed and verified in testing
- **wontfix** - Acknowledged but intentionally not fixing

## Linking to Test Failures

When a bug is discovered through automated testing:

1. Note the test scenario file path
2. Include screenshot/video from test results
3. Reference the error line number
4. Link to the corresponding feature file

**Example:**
```
Test File: .features-gen/features/cart/shopping_cart.feature.spec.js
Scenario: Logged-in user can add product to cart and view cart
Error Location: steps/cart.steps.ts:45
Evidence: test-results/features-cart-shopping_cart.f-*/video.webm
```

## Querying Bugs

### Open critical bugs:
```bash
grep -r "#critical" docs/bugs/ | grep "Status.*open"
```

### All API bugs:
```bash
grep -r "#api" docs/bugs/*.md
```

### Bugs from a specific date:
```bash
ls docs/bugs/BUG-260608-*.md
```

## Examples

See bug reports in this directory for examples of properly formatted bug documentation.

---

**Last Updated:** 2026-06-08
