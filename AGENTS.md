# AGENTS.md

This file defines repository-wide rules for all AI coding agents working in this project.

## Scope
These rules apply to every AI agent and sub-agent operating in this repository.

## Restricted Files (Do Not Modify)
Unless the user explicitly asks in the same request, agents must not create, edit, rename, or delete files matching:

- .env
- .env.*
- **/secrets/**
- **/*.pem
- **/*.key
- **/*.p12
- **/*.pfx
- package-lock.json
- reports/**
- test-results/**
- node_modules/**
- .git/**

## Restricted Paths (Read-Only)
Agents may read but must not write to:

- fixtures/**
- reports/**
- test-results/**

## Safety Rule
If a requested change touches any restricted file/path, agent must:
1. Stop before editing.
2. Ask for explicit confirmation.
3. Proceed only for the files explicitly approved by the user.

## Notes
- Test and build artifacts must not be manually edited.
- Environment and credential files are always treated as sensitive.
- If unsure whether a file is restricted, treat it as restricted and ask first.

---

## Architecture Rules

### Layer Responsibilities

```
Steps → SDK → Adapter → PageObject → Component
```

| Layer | Location | Responsibility |
|---|---|---|
| **Steps** | `steps/*.ts` | BDD glue only. Orchestrate SDK calls, assert via `expect`. No Playwright API. |
| **SDK** | `sdk/*.ts` | Domain façade. Delegates every call to the adapter. No locators, no `page.*`. |
| **Adapter** | `adapters/*.ts` | Translates domain operations to UI or HTTP. Uses PageObjects for UI; uses `sendRequest` for API. No raw `page.locator` — delegate to PageObjects. |
| **PageObject** | `page-objects/*.ts` | Encapsulates locators and actions for one page. May use Components. |
| **Component** | `page-objects/components/*.ts` | Reusable UI building blocks (header, card, auth form). |

### Rules

1. **Steps must NOT use** `world.page.locator()`, `world.page.click()`, `world.page.fill()`, `world.page.goto()`, or any other raw Playwright API.
2. **Steps CAN use** `world.sdk.*`, `world.ui` (UIActions helper), `world.fixtures`, `world.config`, `world.testData`, and any helper from `helpers/`.
3. **Adapters must NOT** contain locator strings or Playwright locator calls. All UI interactions must be delegated to a PageObject or Component method.
4. **PageObjects and Components** are the ONLY place where `Locator`, `page.locator()`, `page.getByRole()`, `page.getByTestId()`, etc. are used.
5. **SDK methods** must match the interface contract (`IAuth`, `ICart`, `ICheckout`, `IProduct`). No Playwright imports in SDKs.
6. **New fine-grained UI steps** (e.g. entering individual fields) must be backed by a corresponding method on the adapter AND the relevant PageObject/Component.

### Adding New Functionality

1. Add the method signature to the interface (`interfaces/*.ts`)
2. Implement the method in the PageObject/Component (locator + action)
3. Implement the method in the WebAdapter (call PageObject method)
4. Add a stub to the ApiAdapter (return default / make HTTP call)
5. Delegate in the SDK
6. Call `world.sdk.xxx.method()` from the step
