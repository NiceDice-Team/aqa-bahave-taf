# API Contract Validation & CI Integration Specification

**Status:** Planning  
**Last Updated:** 2026-06-07  
**Owner:** QA Team  
**Priority:** Medium (Reduces API contract drift risk)

---

## Problem Statement

The `scripts/generate-endpoints.ts` auto-generates `API_ENDPOINTS` from the live OpenAPI schema, but:
- Only **product adapters** use it; **auth/cart/checkout** adapters use manual `ENDPOINTS` constants
- **No automated validation** that adapter calls match the live API contract
- Script is **manual-only**, not integrated into CI/CD
- **Risk of silent endpoint mismatches** after API changes go undetected

---

## Goals

1. **Automated contract validation in CI** – Fail fast on schema drift
2. **Unified endpoint usage** – All adapters use auto-generated `API_ENDPOINTS`
3. **Minimal overhead** – Keep CI fast, maintenance cheap
4. **Optional runtime monitoring** – Detect drift during long test runs

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              Live OpenAPI Schema                │
│              (API_BASE_URL/api/schema/)         │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ generate-endpoints │ (npm run generate:endpoints)
        │    (Phase 1.0)     │
        └────────┬───────────┘
                 │
                 ▼
        ┌──────────────────────────┐
        │ api-endpoints.ts          │
        │ (auto-generated, not      │
        │  manual edit)             │
        └────────┬──────────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
      ▼                     ▼
┌─────────────┐    ┌──────────────────┐
│  Adapters   │    │ validate-        │
│  (auth,     │    │ endpoints        │
│  cart,      │    │ (Phase 1.1)      │
│  checkout)  │    │                  │
└─────────────┘    └────────┬─────────┘
      │                     │
      │ Uses endpoints      │ Compares against
      │ from generated      │ adapter usage
      │ source             │
      └─────────┬──────────┘
                │
                ▼
        ┌──────────────────┐
        │ CI Pipeline      │
        │ (Phase 1.2)      │
        │ Validate step    │
        │ FAILS if drift   │
        └──────────────────┘
```

---

## Implementation Roadmap

### Phase 1: Foundation (40 minutes)

#### 1.1 Contract Validator Script
**File:** `scripts/validate-endpoints.ts`

**Purpose:**
- Parse generated `api-endpoints.ts` and extract all endpoint definitions
- Parse all adapter files (`adapters/*.adapter.ts`) for endpoint string references
- Cross-reference: verify each adapter endpoint exists in generated schema
- Report mismatches with location and severity

**Inputs:**
- `constants/api-endpoints.ts` (generated)
- `adapters/*.adapter.ts` (all adapters)

**Output:**
- Console report with mismatches
- Exit code: 0 (success) or 1 (failure)
- Used by CI pipeline to halt on contract drift

**Scope:** ~150 LOC
- Parse TypeScript to extract endpoint strings (regex patterns)
- Match against generated schema structure
- Format human-readable report

**Acceptance Criteria:**
- ✅ Detects missing endpoints
- ✅ Detects unused generated endpoints
- ✅ CI can fail on critical gaps
- ✅ Runs in < 5 seconds

#### 1.2 CI Integration
**File:** `.github/workflows/ci.yml`

**Changes:**
```yaml
- name: Validate API Contract
  run: npm run validate:endpoints
  if: always()  # Run even if lint fails

- name: Regenerate & Compare Endpoints
  run: npm run generate:endpoints:check
  if: always()
```

**New npm scripts in `package.json`:**
```json
"validate:endpoints": "cross-env TS_NODE_COMPILER_OPTIONS={...} ts-node scripts/validate-endpoints.ts",
"generate:endpoints:check": "cross-env TS_NODE_COMPILER_OPTIONS={...} ts-node scripts/generate-endpoints.ts --check-only"
```

**Behavior:**
- On PR: Run validator before merge
- Fail if schema doesn't match adapter usage
- Generate report artifact for review

**Acceptance Criteria:**
- ✅ CI job exists and runs on every PR
- ✅ Blocks merge if validation fails
- ✅ Clear error message in job log

---

### Phase 2: Unified Adapters (2 hours)

#### 2.1 Migrate Adapters to Generated Endpoints

**Migration Strategy:**
1. Update `constants/endpoints.ts` to import and re-export `API_ENDPOINTS` (backward compat bridge)
2. Update all adapter imports and endpoint usage:
   - `auth.api.adapter.ts` (endpoints: REGISTER, LOGIN, FORGOT_PASSWORD, RESET_PASSWORD)
   - `cart.api.adapter.ts` (endpoints: ADD, REMOVE, UPDATE, SUBTOTAL, ITEMS)
   - `checkout.api.adapter.ts` (endpoints: MAIN, PLACE_ORDER, PAYMENT)
3. Verify method signatures match (e.g., `POST_API_CART_ADD()` vs `(id: string) => ...`)

**Example Transformation:**
```typescript
// Before
import { ENDPOINTS } from '../constants/endpoints';
await this.sendRequest('POST', ENDPOINTS.AUTH.LOGIN, params);

// After
import { API_ENDPOINTS } from '../constants/api-endpoints';
await this.sendRequest('POST', API_ENDPOINTS.POST_API_AUTH_LOGIN, params);
```

**Files to Update:**
- `adapters/auth.api.adapter.ts` (4–6 endpoints)
- `adapters/auth.web.adapter.ts` (navigation only; likely no changes)
- `adapters/cart.api.adapter.ts` (6–8 endpoints)
- `adapters/cart.web.adapter.ts` (UI actions; no HTTP endpoints)
- `adapters/checkout.api.adapter.ts` (5–7 endpoints)
- `adapters/checkout.web.adapter.ts` (UI actions; no HTTP endpoints)

**Acceptance Criteria:**
- ✅ All adapters compile without errors
- ✅ Test suite passes (no functional changes)
- ✅ No manual endpoint strings in adapter methods
- ✅ `ENDPOINTS` can be deprecated (or kept as thin re-export)

#### 2.2 Update Interfaces & Types
**Files:** `interfaces/*.interface.ts`

Ensure interface methods match the endpoints actually available in generated schema.

**Acceptance Criteria:**
- ✅ All method signatures compile
- ✅ No unused interface methods

---

### Phase 3: Runtime Monitoring (Optional, 4 hours)

#### 3.1 MCP Server for Contract Drift Detection

**When to use:** Long-running test suites or on-demand validation

**MCP Tools Exposed:**
```typescript
// Check if endpoint is available on live API
check_endpoint_availability(endpoint: string, method: 'GET'|'POST'|'PUT'|'DELETE'|'PATCH')
  → { available: boolean, statusCode: number, error?: string }

// Get current live schema version
get_live_schema_version()
  → { timestamp: ISO8601, hash: string, endpointCount: number }

// Compare generated vs live
compare_schemas()
  → { matches: boolean, added: string[], removed: string[], modified: string[] }
```

**Usage in Test Hooks:**
```typescript
// support/world.ts
Before(async function() {
  if (process.env.VALIDATE_CONTRACT === 'true') {
    const comparison = await world.mcp.compare_schemas();
    if (!comparison.matches) {
      console.warn(`⚠️ API schema drift detected:`, comparison);
      // Log but don't fail; let validator catch it in CI
    }
  }
});
```

**Acceptance Criteria:**
- ✅ MCP server exposes contract tools
- ✅ Test hooks can optionally call validation
- ✅ No performance impact if disabled
- ✅ Clear warnings on schema drift

---

### Phase 4: Agent-Driven Scheduled Checks (Optional, 1 hour)

#### 4.1 Weekly Contract Monitor Workflow

**File:** `.github/workflows/contract-monitor.yml`

**Behavior:**
- Scheduled daily/weekly (e.g., Monday 9 AM UTC)
- Fetch live OpenAPI schema
- Generate endpoints
- Compare with last known version
- Post issue comment or Slack notification if drift detected

**Example:**
```yaml
name: Daily Contract Monitor
on:
  schedule:
    - cron: '0 9 * * 1'  # Monday 9 AM UTC

jobs:
  check-contract:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run generate:endpoints
      - run: git diff --exit-code constants/api-endpoints.ts || echo "DRIFT_DETECTED=true" >> $GITHUB_ENV
      - if: env.DRIFT_DETECTED
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              body: '⚠️ API schema drift detected. Review changes: ...'
            })
```

**Acceptance Criteria:**
- ✅ Workflow runs on schedule
- ✅ Detects and reports drift
- ✅ Does not block PRs (informational only)

---

## Success Criteria

| Phase | Criteria |
|-------|----------|
| **1** | ✅ Validator script works; CI fails on drift; validator runs in < 5 sec |
| **2** | ✅ All adapters use `API_ENDPOINTS`; tests pass; no manual strings |
| **3** | ✅ MCP tools exposed; test hooks can validate; no perf impact |
| **4** | ✅ Workflow runs; posts drift alerts; non-blocking |

---

## Effort Estimate

| Phase | Effort | Owner | Depends On |
|-------|--------|-------|-----------|
| **1** | 40 min | Dev | None |
| **2** | 2 hrs | Dev | Phase 1 ✓ |
| **3** | 4 hrs | Dev | Phase 2 ✓ |
| **4** | 1 hr | Dev | Phase 2 ✓ |
| **Total MVP** | **2.5 hrs** | – | – |
| **Full Stack** | **~9 hrs** | – | – |

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Breaking existing tests | Use backward-compat bridge; migrate incrementally |
| Endpoint name mismatches | Validator catches mismatches in PR; manual review required |
| CI slowdown | Validator runs in < 5 sec; no impact on main pipeline |
| False positives | Validator reports with context; developer reviews before merge |

---

## Design Decisions

### Why Not Full MCP From Day 1?
- Validator script is **simpler, faster**, and runs everywhere (no external dependency)
- MCP adds latency; validator can complete in seconds within CI
- Keep MVP focused; add MCP later for long-running background tasks

### Why Agents Are Optional
- Phases 1–2: Straightforward scripting; no need for agent complexity
- Phase 4: Agent value is in scheduling + multi-repo logic (not needed yet)
- Recommend revisiting if you add multi-service monitoring

### Why Backward Compatibility?
- Adapters still compile during migration
- `ENDPOINTS` can re-export generated endpoints
- Zero breaking changes; can roll back if needed

---

## Execution Plan

### Week 1: MVP (Phases 1–2)
1. Implement validator script (`scripts/validate-endpoints.ts`)
2. Integrate into CI (`.github/workflows/ci.yml`)
3. Migrate auth/cart/checkout adapters
4. Test end-to-end; commit + merge

### Week 2+: Optional (Phases 3–4)
- MCP integration if long-running tests needed
- Scheduled monitor if multi-service monitoring desired

---

## Maintenance & Monitoring

### Weekly
- Review contract validator reports in CI logs
- Note any failing PRs due to contract drift

### Monthly
- Review generated schema for material changes
- Update adapter methods if API added new endpoints

### Quarterly
- Evaluate if MCP drift detection is useful
- Consider agent-driven monitoring

**Estimated Maintenance:** ~15 min/month

---

## Related Files

- [README.md](./README.md) – Project overview
- [scripts/generate-endpoints.ts](./scripts/generate-endpoints.ts) – Endpoint generation
- [constants/api-endpoints.ts](./constants/api-endpoints.ts) – Generated endpoints
- [adapters/](./adapters/) – Adapter implementations
- [.github/workflows/ci.yml](./.github/workflows/ci.yml) – CI pipeline

---

## Questions & Decisions Pending

- [ ] Should validator fail hard or warn?
  - **Decision:** Hard fail in PR; catch all drift early
- [ ] Who reviews schema diffs?
  - **Decision:** PR reviewer; validator surfaces all changes
- [ ] Should we keep manual `ENDPOINTS` for reference?
  - **Decision:** No; delete after migration; use generated only

---

## Sign-Off

- **Spec Author:** QA Team
- **Reviewed By:** (pending)
- **Approved By:** (pending)
- **Implementation Lead:** (pending)

---

*For updates or questions, open an issue or contact the QA team.*
