# Tests

Unit tests live next to the code they test:

| Where | What | Run |
|---|---|---|
| `frontend/src/**/*.test.jsx` | Vitest + React Testing Library | `cd frontend && npm test` |

This folder is for tests that span the whole system:

| Folder | Purpose |
|---|---|
| `e2e/` | End-to-end browser tests of the user journey (Search → Discover → Compare → Connect), e.g. with Playwright |
| `integration/` | Tests that run against a real Supabase project (RLS policies, the `api` Edge Function) |
| `performance/` | Load tests for search and enquiry queries |

Each acceptance criterion in `docs/requirements` (PBI-UX-01 and up) should be covered by at least one test.
