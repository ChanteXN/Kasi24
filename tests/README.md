# Tests

Unit tests live next to the code they test:

| Where | What | Run |
|---|---|---|
| `backend/src/test/java` | JUnit 5 + Spring Boot tests (controller, service, repository) | `cd backend && mvn test` |
| `frontend/src/**/*.test.jsx` | Vitest + React Testing Library | `cd frontend && npm test` |

This folder is for tests that span the whole system:

| Folder | Purpose |
|---|---|
| `e2e/` | End-to-end browser tests of the user journey (Search → Discover → Compare → Connect), e.g. with Playwright |
| `integration/` | API tests that run against a real backend + Supabase database |
| `performance/` | Load tests for search and enquiry endpoints |

Each acceptance criterion in `docs/requirements` (PBI-UX-01 and up) should be covered by at least one test.
