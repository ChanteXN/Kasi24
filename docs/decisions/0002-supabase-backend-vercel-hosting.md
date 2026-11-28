# 0002 - Supabase as the backend, Vercel for hosting

**Status:** Accepted
**Date:** 2026-11-28
**Supersedes:** [0001 - Tech stack](0001-tech-stack.md) (backend part)

## Context

The first scaffold had a Java 21 / Spring Boot API between React and Supabase. The team built the live Supabase project with Row Level Security, Storage and an Edge Function, which covers everything the Java API was going to do.

## Decision

- Remove the Java backend. `backend/` now holds the Supabase project (`backend/supabase`: config, migrations, Edge Functions).
- React reads and writes through `supabase-js`, protected by Row Level Security.
- Trusted workflows (onboarding, listing submit, staff reviews) run in the `api` Edge Function.
- Host the frontend on Vercel. GitHub Actions deploys Supabase first, then Vercel, on merge to `main`.

## Consequences

- One less service to build, host and secure.
- Security depends on RLS policies being correct, so policy changes need careful review.
- The database schema must be kept in `backend/supabase/migrations` so the repo can rebuild it.
