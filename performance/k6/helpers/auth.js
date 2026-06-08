import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.API_BASE_URL || 'http://localhost:3000';

/**
 * Obtain a JWT token pair for the given credentials.
 * Returns { accessToken, refreshToken } or throws on failure.
 */
export function getAuthTokens(email, password) {
  const res = http.post(
    `${BASE_URL}/api/users/token/`,
    JSON.stringify({ email, password }),
    { headers: { 'Content-Type': 'application/json' } },
  );

  check(res, { 'login 200': (r) => r.status === 200 });

  if (res.status !== 200) {
    throw new Error(`Auth failed: ${res.status} – ${res.body}`);
  }

  const body = res.json();
  return {
    accessToken: body.access,
    refreshToken: body.refresh,
  };
}

/**
 * Build an Authorization header object for authenticated requests.
 */
export function authHeaders(accessToken) {
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
}
