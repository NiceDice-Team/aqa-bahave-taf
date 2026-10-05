# Bug Report Template

**Title:** [Brief description of the bug]

**Bug ID:** BUG-[YYMMDD]-[NUMBER] (e.g., BUG-260608-001)

**Tags:**

- `#bug` (always include)
- `#api` (if API-related) / `#fe` (if Frontend-related)
- `#critical` / `#major` / `#minor` / `#trivial` (severity)
- `[feature-name]` (e.g., `#cart`, `#checkout`, `#auth`)

---

## Description

Clear and concise description of the bug.

## Environment

- **Environment:** local / staging / production
- **Frontend URL:** `http://localhost:3000`
- **API URL:** `http://localhost:8000/api/`
- **Mailcatcher URL:** `http://localhost:1080` (when email is involved)
- **Browser:** Chromium / Firefox / WebKit
- **OS:** [name and version]
- **Pinned backend commit:** [submodule SHA]
- **Pinned frontend commit:** [submodule SHA]
- **Test data:** [seed command or non-sensitive fixture reference]

## Steps to Reproduce

1. Step 1
2. Step 2
3. Step 3

## Expected Behavior

What should happen

## Actual Behavior

What actually happens

## Screenshots/Logs

[Attach test-results screenshots, videos, or error logs]

## Severity

- `#critical` - System broken, complete feature failure
- `#major` - Feature partially broken, impacts core functionality
- `#minor` - Feature works but with glitches
- `#trivial` - Cosmetic or non-functional issue

## Status

- `open` - Not yet fixed
- `in-progress` - Being worked on
- `resolved` - Fixed and verified
- `wontfix` - Acknowledged but will not fix

## Related Test Scenario

- Test File: `.features-gen/features/[feature]/[scenario].feature.spec.js`
- Scenario: [Name]
- Source Feature: `features/[feature]/[scenario].feature`
- Tags: [for example `@critical-journey @login @broken`]
- Command: [for example `npm run test:critical:all`]

## Local Service Evidence

- Frontend status/log excerpt:
- Backend status/log excerpt:
- Mailcatcher message ID and recipient (never paste activation tokens):
- Last backend request observed:

## Notes

Additional context or notes about the bug.

---

## Resolution

[Document how the bug was fixed or why it won't be fixed]
