# Infrastructure

Production hosting is **Vercel** (frontend) and **Supabase** (backend), deployed by `.github/workflows/ci.yml`. See [docs/deployment.md](../docs/deployment.md).

This folder holds optional extras that are not part of the production path:

| Folder | Purpose |
|---|---|
| `docker/` | Builds the frontend into an nginx container, for running the built site locally or on another host |
| `scripts/` | Helper scripts for development and maintenance |

The backend configuration lives in `backend/supabase/`, not here.
