# Contributing to Kasi24

## Branches

- `main` - always working, demo-ready. Nobody pushes to it directly.
- `develop` - integration branch for finished features.
- Feature branches come off `develop`:
  - `feature/PBI-UX-01-area-search`
  - `fix/enquiry-date-validation`
  - `docs/api-endpoints`

## Workflow

1. Pick a story from the project board and assign yourself.
2. `git checkout develop && git pull`
3. `git checkout -b feature/PBI-UX-XX-short-name`
4. Commit small, clear changes: `feat: add area search to landing page`
5. Push and open a Pull Request into `develop`.
6. At least **one other team member** reviews and approves before merging.
7. CI (build + tests) must pass. Your PR gets a Vercel preview link to check the change.
8. Merging `develop` into `main` deploys to production (Supabase first, then Vercel). See [docs/deployment.md](docs/deployment.md).

Push your branches to `ChanteXN/Kasi24` (ask to be added as a collaborator). PRs from forks still run tests but get no preview link.

## Commit message prefixes

`feat:` new feature · `fix:` bug fix · `docs:` documentation · `test:` tests · `refactor:` code change with no behaviour change · `chore:` build, config, dependencies

## Code conventions

**Backend (Supabase, in `backend/supabase`):** schema changes only via new migration files; every table needs RLS; privileged workflows (approvals, onboarding) go through the `api` Edge Function, never the browser; no service_role key outside Edge Functions.

**Frontend:** one page component per screen in `pages/`; reusable pieces in `components/`; all API calls go through `services/`; use the colour variables in `styles/global.css`.

**Everyone:** no secrets in code or commits; show "Not stated" for unknown listing details instead of guessing.
