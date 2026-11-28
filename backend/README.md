# Kasi24 backend (Supabase)

The backend is a hosted Supabase project: **PostgreSQL with Row Level Security**, **Auth**, **Storage** and one **Edge Function** (`api`). There is no separate server to run.

```
backend/
└── supabase/                 Supabase CLI project (run CLI commands from backend/)
    ├── config.toml           CLI config (project id, function settings)
    ├── migrations/           Database schema, one timestamped .sql file per change
    └── functions/
        └── api/index.ts      Edge Function for trusted workflows
```

## The live project is the source of truth (for now)

The live KASI24 project (Khayelitsha Site B/C rental marketplace) was built from the "Kasi24 Supabase Production Schema Specification": areas, providers, listings, private address and evidence tables, enquiries, storage buckets, audit trail.

**That schema is not yet in `migrations/`.** Until it is, nobody can rebuild the database from this repo. Whoever has owner access should capture it once:

```bash
cd backend
supabase login
supabase link --project-ref <project-ref>
supabase db pull            # writes supabase/migrations/<timestamp>_remote_schema.sql
```

Commit that file. From then on every schema change is a **new** migration file, and the CI/CD pipeline applies it on merge to `main`.

The schema from the earlier Java prototype is kept for reference only in `docs/archive/legacy-java-schema/`. **Never run it against the live project.**

## Edge Function `api`

All routes are `POST` and need a signed-in user's JWT:

| Route | Who | What |
|---|---|---|
| `provider/onboard` | Signed-in user | Creates provider profile + private identity record |
| `listings` | Provider | Creates a draft listing with address, amenities and evidence |
| `listings/<id>/submit` | Listing owner | Draft/rejected → pending review |
| `listings/<id>/review` | Moderator/admin | Approve or reject a listing |
| `evidence/<id>/review` | Moderator/admin | Approve or reject listing evidence |
| `providers/<id>/review` | Moderator/admin | Verify or reject a provider |

Secrets the function reads (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_DB_URL`) are provided by Supabase automatically. Set one yourself:

```bash
supabase secrets set ALLOWED_ORIGIN=https://<your-vercel-domain> --project-ref <project-ref>
```

Without it, the function accepts browser calls from any website.

Manual deploy (CI does this on merge to `main`):

```bash
cd backend
supabase functions deploy api --project-ref <project-ref>
```

## Local development (optional)

Needs Docker and the Supabase CLI.

```bash
cd backend
supabase start              # local Postgres, Auth, Storage, Studio
supabase db reset           # applies migrations/
supabase functions serve api
```

## Rules

- Every table has RLS enabled. The browser only ever holds the publishable key.
- The `service_role` / secret key never leaves Supabase (Edge Function secrets only).
- Anything that touches the `private` schema or changes a status goes through the `api` function.
- Staff roles (`moderator`, `admin`) are granted in `private.user_roles` by a database admin, never from the app.
- Never edit a migration that has already been applied. Add a new one.
