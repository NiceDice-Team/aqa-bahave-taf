# UAT order journeys

The `@uat-order` suite covers three deployed-environment paths:

1. anonymous checkout with cash on delivery;
2. registration, MailHog activation, login, and cash-on-delivery checkout;
3. registration, activation, login, and a Stripe test-card checkout.

Run it locally in browserless mode:

```bash
NODE_ENV=staging \
FRONTEND_BASE_URL=https://nd-uat.oleksandrdoroshenko.com \
API_BASE_URL=https://nd-api.oleksandrdoroshenko.com \
MAILCATCHER_BASE_URL=https://nd-mc.oleksandrdoroshenko.com \
HEADLESS=true PARALLEL_WORKERS=3 npm run test:uat:orders
```

The suite refuses to run unless `NODE_ENV=staging` and the configured hosts are
the NiceDice UAT frontend and API. Stripe uses the documented Stripe test card
`4242 4242 4242 4242`; it must never be pointed at production or supplied with
real card data.

GitHub Actions can run the suite manually or from a `repository_dispatch` event
named `uat-deployed`. Failures remain failures and the HTML report, JSON report,
screenshots, traces, and videos are uploaded for diagnosis.

The repository currently has no committed npm lockfile, so remote runners use
`npm install`. Add a reviewed lockfile in a dedicated dependency change before
switching these jobs to the more reproducible `npm ci` command.

## Current UAT blockers (2026-10-26)

- `GET /api/orders/payment-methods/` returns HTTP 404.
- `GET /api/orders/delivery-options/` returns HTTP 404.
- authenticated cart requests use frontend routes `/api/cart/` and
  `/api/cart/item/` with `product_id`, while the deployed backend exposes
  `/api/carts/` and requires `user`, `product`, and `quantity`;
- the guest cart can fall back to browser storage, but order creation still
  requires a backend-issued `guest_cart_token` that the deployed backend does
  not provide;
- the deployed backend order endpoint requires `user_id`, while the frontend
  sends authenticated `cart_id` or anonymous `guest_cart_token` plus delivery,
  payment, and address fields;
- the backend order model has no delivery option, payment method, guest owner,
  shipping/billing address, or payment status fields.

These are application contract failures, not test failures. The journeys are
intentionally strict so they become a useful acceptance gate when the checkout
implementation is completed.
