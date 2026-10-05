# Local Critical User Journeys

## Purpose

The `@critical-journey` suite protects the customer paths that must work before
a build can be considered releasable. It runs against local NiceDice frontend,
backend, PostgreSQL, and Mailcatcher services. It does not call a deployed
environment or an external payment provider.

```bash
npm run test:generate
npm run test:critical
```

The MR gate excludes scenarios tagged `@broken`. Run every critical scenario,
including quarantined failures, with:

```bash
npm run test:critical:all
```

## Covered journeys

The scenarios in `features/journeys/critical-user-journeys.feature` cover:

1. Valid registration with a unique email.
2. Delivery of an activation email to local Mailcatcher.
3. Extraction and use of the backend activation URL and token.
4. Login with the newly activated account.
5. Password-reset request without disclosing account existence.
6. Login with the seeded active local customer.
7. Catalog loading, product discovery, and product-detail rendering.
8. Adding a product to an empty cart.
9. Increasing quantity and validating a positive subtotal.
10. Completing shipping and reaching order review.
11. Verifying order placement is available without invoking payment.

## Repository and revision model

Frontend and backend remain separate repositories, included here as Git
submodules under `services/`:

- `NiceDice-Team/aqa-bahave-taf`
- `NiceDice-Team/backend`
- `NiceDice-Team/team-challange-front`

Each TAF commit pins exact frontend and backend commits. Both submodules track
their respective `main` branch when explicitly updated with:

```bash
git submodule update --remote services/backend services/frontend
```

Clone or initialize the repository with:

```bash
git clone --recurse-submodules <taf-repository-url>
# or, after a normal clone:
git submodule update --init --recursive
```

## Local services

| Service     | Default URL             | Purpose          |
| ----------- | ----------------------- | ---------------- |
| Frontend    | `http://localhost:3000` | Browser journeys |
| Backend     | `http://localhost:8000` | NiceDice API     |
| Mailcatcher | `http://localhost:1080` | Email capture    |
| PostgreSQL  | `localhost:5432`        | Local test data  |

`MAILCATCHER_BASE_URL` can override the Mailcatcher URL. When
`NODE_ENV=local`, HTTP targets must use a loopback hostname or the exact local
Compose service names `backend`, `frontend`, and `mailcatcher`. Configuration
validation stops the run for any other host.

## Preparing the local stack

From the backend repository:

```bash
docker compose up -d
docker compose exec -T backend python manage.py load_test_data
```

From the frontend repository:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api/ npm run dev
```

From this repository:

```bash
npm run test:critical
```

To build the complete pinned stack and execute the same gate in Docker:

```bash
npm run docker:test
```

The seeded account expected by the authenticated journey is local-only:

- email: `customer@nicedice.com`
- password: `Secret12345`

## Mailcatcher activation

`helpers/mailcatcher.ts` polls `GET /messages` for the unique recipient,
retrieves the plain message, extracts the
`/api/users/activate/<uid>/<token>/` URL, and follows it through Playwright's
request context. It accepts only loopback hosts or the Docker-local `backend`
service name.

This helper was verified with a real local Mailcatcher message and returned
`activated=true`.

## Architecture

```text
Feature → Step → SDK → Adapter → PageObject
                           └── Mailcatcher helper for local email HTTP
```

The domain operations are exposed through the auth, product, cart, and checkout
interfaces. Step definitions contain no page locators.

## Payment boundary

Checkout ends on order review after verifying that **Place order** is available.
It does not click that action or contact Stripe, LiqPay, or another provider.

## CI execution

The `critical-journeys.yml` workflow:

1. Checks out TAF and its pinned frontend/backend submodule commits.
2. Builds the full stack from the root `docker-compose.yml`.
3. Starts PostgreSQL, Mailcatcher, and the backend.
4. Loads deterministic backend test data in a one-shot seed container.
5. Starts the frontend with Docker-local backend configuration.
6. Runs BDD generation and `npm run test:critical` in the Playwright container.
7. Uploads Playwright artifacts and Compose logs, then removes the stack.

For private submodule checkout, configure `NICE_DICE_REPOS_TOKEN` with read
access to all three repositories. Testing a frontend or backend feature branch
requires updating and committing that submodule pointer in the TAF branch.

The workflow is expected to fail while a critical application blocker exists.
Broken scenarios are quarantined with an explicit `@broken` tag while their
application defects are open. They stay executable through
`npm run test:critical:all`; do not delete them or weaken their assertions.

## Verification status

Passing checks:

- BDD generation
- TypeScript compilation
- ESLint
- Local catalog-to-product journey
- Mailcatcher activation-link extraction and account activation

Current MR gate: one runnable catalog/product journey. Registration, password
recovery, login, and authenticated commerce are marked `@broken` because the
confirmed authentication CORS defect prevents their first required POST.

## Known local integration blockers

### Authentication CORS preflight

The frontend adds `Cache-Control` to registration, login, and password-recovery
requests. The backend `CORS_ALLOW_HEADERS` list omits `cache-control`. Django
receives `OPTIONS`, but the browser blocks the subsequent `POST`.

Expected resolution: allow `cache-control` in backend CORS configuration or stop
adding it to cross-origin frontend requests.

### Guest-cart endpoint mismatch

The frontend requests `/api/cart/guest/`; the current local backend returns 404.

### Product-review endpoint mismatch

The frontend requests `/api/products/products/<id>/reviews/`, which returns 404
because the product path segment is duplicated.

## Reporting failures

A red critical suite is a release signal, not a reason to relax assertions.
Attach the Playwright trace, screenshot, browser error, and backend log to a bug
created from `docs/bugs/BUG_TEMPLATE.md`.
