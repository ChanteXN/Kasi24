# Supabase

Kasi24 uses Supabase for **PostgreSQL** (the database) and **Auth** (sign-up and sign-in).

## Set up the shared project

1. One team member creates a project at https://supabase.com and invites the others (Project Settings → Team).
2. Run the migrations in `migrations/` in order, in the Supabase SQL editor or with the CLI.
3. Optionally run `seed.sql` to load **fictional** demo listings.
4. Each developer copies the values into their own `backend/.env` and `frontend/.env.local` (see the `.env.example` files).

## Running locally with the Supabase CLI (optional)

```bash
supabase init        # once, creates supabase/config.toml
supabase start       # local Postgres on 54322, API on 54321
supabase db reset    # applies migrations + seed
```

## Rules

- Never commit real keys or passwords. The `service_role` key must never reach the frontend.
- Schema changes go in a **new** migration file named `YYYYMMDDHHMMSS_description.sql`. Do not edit migrations that have already been applied.
