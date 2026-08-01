/**
 * Shared performance thresholds applied to all k6 scenarios.
 *
 * Adjust the values below to match your SLA/SLO targets.
 */
export const COMMON_THRESHOLDS = {
  // 95-th percentile response time must stay under 2 s
  http_req_duration: ['p(95)<2000'],
  // Error rate must not exceed 1 %
  http_req_failed: ['rate<0.01'],
};
