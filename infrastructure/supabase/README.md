# Supabase

> **Source of truth.** The live KASI24 Supabase project (Khayelitsha Site B/C accommodation marketplace) was built from the
> "Kasi24 Supabase Production Schema Specification" and is richer than `migrations/20261113000001_initial_schema.sql`
> (areas, providers, private address/evidence tables, enquiries with RLS, storage buckets, audit trail).
> **Do not run the old initial migration or `seed.sql` against the live project** - they describe an earlier, simpler schema
> used by an earlier Java prototype (since removed). The React app now reads the live schema directly with `supabase-js`
> and uses the `api` Edge Function (source in `functions/api/index.ts`) for trusted workflows.

Kasi24 uses Supabase for **PostgreSQL** (the database) and **Auth** (sign-up and sign-in).

## Set up the shared project

1. One team member creates a project at https://supabase.com and invites the others (Project Settings → Team).
2. Run the migrations in `migrations/` in order, in the Supabase SQL editor or with the CLI.
3. Optionally run `seed.sql` to load **fictional** demo listings.
4. Each developer copies the values into their own `frontend/.env.local` (see `frontend/.env.example`).

## Running locally with the Supabase CLI (optional)

```bash
supabase init        # once, creates supabase/config.toml
supabase start       # local Postgres on 54322, API on 54321
supabase db reset    # applies migrations + seed
```

## Rules

- Never commit real keys or passwords. The `service_role` key must never reach the frontend.
- Schema changes go in a **new** migration file named `YYYYMMDDHHMMSS_description.sql`. Do not edit migrations that have already been applied.

## Edge Function `api`

Source: `functions/api/index.ts`. Deploy with `supabase functions deploy api --project-ref <ref>`.
Routes (all `POST`, JWT required): `provider/onboard`, `listings`, `listings/<id>/submit`, `listings/<id>/review`,
`evidence/<id>/review`, `providers/<id>/review`.

## Frontend connection

`frontend/.env.local` needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (Project Settings > API).
Signed-out visitors can read areas, amenities and approved listings; customers can send enquiries; everything else is
enforced by Row Level Security.
