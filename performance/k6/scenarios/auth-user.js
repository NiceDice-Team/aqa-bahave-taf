/**
 * k6 performance scenario – Authenticated user
 *
 * Simulates a logged-in shopper: login → browse catalogue → view product →
 * add to cart → view cart → view orders.
 *
 * Environment variables:
 *   API_BASE_URL        – e.g. https://bgshop.work.gd          (required)
 *   TEST_USER_EMAIL     – test account email                    (required)
 *   TEST_USER_PASSWORD  – test account password                 (required)
 *   PRODUCT_ID          – specific product ID to hit; default "1"
 *   VUS                 – virtual users                         (default: 5)
 *   DURATION            – ramp duration                         (default: "30s")
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { SharedArray } from 'k6/data';
import { COMMON_THRESHOLDS } from '../thresholds.js';
import { getAuthTokens, authHeaders } from '../helpers/auth.js';

// ── Custom metrics ────────────────────────────────────────────────────────────
const loginDuration = new Trend('auth_login_duration', true);
const cartDuration = new Trend('auth_cart_duration', true);
const ordersDuration = new Trend('auth_orders_duration', true);
const errorRate = new Rate('auth_error_rate');

// ── Config ────────────────────────────────────────────────────────────────────
const BASE_URL = __ENV.API_BASE_URL || 'http://localhost:3000';
const PRODUCT_ID = __ENV.PRODUCT_ID || '1';

// Credentials are read once from env and shared across all VUs.
// Using SharedArray avoids replicating the array per VU in memory.
const credentials = new SharedArray('credentials', function () {
  return [
    {
      email: __ENV.TEST_USER_EMAIL || '',
      password: __ENV.TEST_USER_PASSWORD || '',
    },
  ];
});

export const options = {
  scenarios: {
    auth_user_flow: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: __ENV.DURATION || '30s', target: parseInt(__ENV.VUS || '5') },
        { duration: '1m', target: parseInt(__ENV.VUS || '5') },
        { duration: '15s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: {
    ...COMMON_THRESHOLDS,
    auth_login_duration: ['p(95)<1500'],
    auth_cart_duration: ['p(95)<1500'],
    auth_orders_duration: ['p(95)<2000'],
    auth_error_rate: ['rate<0.01'],
  },
};

// ── Scenario ──────────────────────────────────────────────────────────────────
export default function () {
  const cred = credentials[0];

  if (!cred.email || !cred.password) {
    console.error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set.');
    return;
  }

  // ── Step 1: Login ──────────────────────────────────────────────────────────
  let accessToken;
  group('Auth – login', () => {
    const res = http.post(
      `${BASE_URL}/api/users/token/`,
      JSON.stringify({ email: cred.email, password: cred.password }),
      { headers: { 'Content-Type': 'application/json' } },
    );
    loginDuration.add(res.timings.duration);
    const ok = check(res, {
      'login: status 200': (r) => r.status === 200,
      'login: has access token': (r) => {
        try {
          return !!r.json().access;
        } catch {
          return false;
        }
      },
    });
    errorRate.add(!ok);
    if (ok) {
      accessToken = res.json().access;
    }
  });

  if (!accessToken) {
    // Authentication failed – abort this iteration
    return;
  }

  const headers = authHeaders(accessToken);

  sleep(0.5);

  // ── Step 2: Browse catalogue ───────────────────────────────────────────────
  group('Auth – product catalogue', () => {
    const res = http.get(`${BASE_URL}/api/products/`, { headers });
    const ok = check(res, {
      'auth products list: status 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
  });

  sleep(0.5);

  // ── Step 3: View product detail ────────────────────────────────────────────
  group('Auth – product detail', () => {
    const res = http.get(`${BASE_URL}/api/products/${PRODUCT_ID}/`, { headers });
    const ok = check(res, {
      'auth product detail: status 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
  });

  sleep(0.5);

  // ── Step 4: View authenticated cart ───────────────────────────────────────
  group('Auth – view cart', () => {
    const res = http.get(`${BASE_URL}/api/cart/`, { headers });
    cartDuration.add(res.timings.duration);
    const ok = check(res, {
      'auth view cart: status 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
  });

  sleep(0.5);

  // ── Step 5: Add item to cart ───────────────────────────────────────────────
  group('Auth – add item to cart', () => {
    const payload = JSON.stringify({ product_id: parseInt(PRODUCT_ID), quantity: 1 });
    const res = http.post(`${BASE_URL}/api/cart/item/`, payload, { headers });
    cartDuration.add(res.timings.duration);
    const ok = check(res, {
      'auth add-to-cart: status 200 or 201': (r) => r.status === 200 || r.status === 201,
    });
    errorRate.add(!ok);
  });

  sleep(0.5);

  // ── Step 6: View order history ─────────────────────────────────────────────
  group('Auth – order history', () => {
    const res = http.get(`${BASE_URL}/api/orders/`, { headers });
    ordersDuration.add(res.timings.duration);
    const ok = check(res, {
      'auth orders: status 200': (r) => r.status === 200,
    });
    errorRate.add(!ok);
  });

  sleep(1);

  // ── Step 7: Logout ─────────────────────────────────────────────────────────
  group('Auth – logout', () => {
    const res = http.post(`${BASE_URL}/api/users/logout/`, null, { headers });
    check(res, {
      'logout: status 200 or 205': (r) => r.status === 200 || r.status === 205,
    });
  });

  sleep(1);
}
