/**
 * k6 performance scenario – Guest (unauthenticated) user
 *
 * Simulates an anonymous shopper browsing the catalogue, viewing a product
 * detail page and managing a guest cart.
 *
 * Environment variables (all optional – fall back to defaults):
 *   API_BASE_URL   – e.g. https://bgshop.work.gd
 *   PRODUCT_ID     – specific product ID to hit; defaults to "1"
 *   VUS            – number of virtual users   (default: 10)
 *   DURATION       – ramp duration             (default: "1m")
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { COMMON_THRESHOLDS } from '../thresholds.js';

// ── Custom metrics ────────────────────────────────────────────────────────────
const productListDuration = new Trend('guest_product_list_duration', true);
const productDetailDuration = new Trend('guest_product_detail_duration', true);
const guestCartDuration = new Trend('guest_cart_duration', true);
const errorRate = new Rate('guest_error_rate');

// ── Config ────────────────────────────────────────────────────────────────────
const BASE_URL = __ENV.API_BASE_URL || 'http://localhost:3000';
const PRODUCT_ID = __ENV.PRODUCT_ID || '1';

export const options = {
  scenarios: {
    guest_browsing: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: __ENV.DURATION || '30s', target: parseInt(__ENV.VUS || '10') },
        { duration: '1m', target: parseInt(__ENV.VUS || '10') },
        { duration: '15s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: {
    ...COMMON_THRESHOLDS,
    guest_product_list_duration: ['p(95)<1500'],
    guest_product_detail_duration: ['p(95)<1000'],
    guest_cart_duration: ['p(95)<1500'],
    guest_error_rate: ['rate<0.01'],
  },
};

// ── Scenario ──────────────────────────────────────────────────────────────────
export default function () {
  const headers = { 'Content-Type': 'application/json' };
  let sessionToken = null;

  // 1. Browse product catalogue
  group('Guest – product catalogue', () => {
    const res = http.get(`${BASE_URL}/api/products/`, { headers });
    productListDuration.add(res.timings.duration);
    const ok = check(res, {
      'products list: status 200': (r) => r.status === 200,
      'products list: has results': (r) => {
        try {
          const body = r.json();
          return Array.isArray(body) || (body.results && body.results.length >= 0);
        } catch {
          return false;
        }
      },
    });
    errorRate.add(!ok);
  });

  sleep(1);

  // 2. View product detail
  group('Guest – product detail', () => {
    const res = http.get(`${BASE_URL}/api/products/${PRODUCT_ID}/`, { headers });
    productDetailDuration.add(res.timings.duration);
    const ok = check(res, {
      'product detail: status 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
  });

  sleep(0.5);

  // 3. Create a guest cart session
  group('Guest – create cart', () => {
    const createRes = http.post(`${BASE_URL}/api/cart/guest/`, JSON.stringify({}), { headers });
    guestCartDuration.add(createRes.timings.duration);
    const ok = check(createRes, {
      'guest cart create: status 200 or 201': (r) => r.status === 200 || r.status === 201,
    });
    errorRate.add(!ok);

    if (ok) {
      try {
        const body = createRes.json();
        sessionToken = body.session_token || body.token || null;
      } catch {
        // session token not critical for the scenario
      }
    }
  });

  sleep(0.5);

  // 4. Add item to guest cart (requires session token from step 3)
  if (sessionToken) {
    group('Guest – add item to cart', () => {
      const cartHeaders = { ...headers, 'X-Session-Token': sessionToken };
      const payload = JSON.stringify({ product_id: parseInt(PRODUCT_ID), quantity: 1 });
      const res = http.post(`${BASE_URL}/api/cart/guest/item/`, payload, { headers: cartHeaders });
      guestCartDuration.add(res.timings.duration);
      const ok = check(res, {
        'guest add-to-cart: status 200 or 201': (r) => r.status === 200 || r.status === 201,
      });
      errorRate.add(!ok);
    });

    sleep(0.5);

    // 5. View guest cart
    group('Guest – view cart', () => {
      const cartHeaders = { ...headers, 'X-Session-Token': sessionToken };
      const res = http.get(`${BASE_URL}/api/cart/guest/`, { headers: cartHeaders });
      guestCartDuration.add(res.timings.duration);
      const ok = check(res, {
        'guest view cart: status 200': (r) => r.status === 200,
      });
      errorRate.add(!ok);
    });

    sleep(0.5);
  }

  // 6. Check product count (public endpoint)
  group('Guest – product count', () => {
    const res = http.get(`${BASE_URL}/api/products/count/`, { headers });
    const ok = check(res, {
      'product count: status 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
  });

  sleep(1);
}
