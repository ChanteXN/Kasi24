# 0001 - Tech stack

**Status:** Accepted
**Date:** 2026-11-13

## Decision

- **Backend:** Java 21, Spring Boot 3, Maven
- **Database and auth:** Supabase (PostgreSQL + Supabase Auth)
- **Frontend:** React 18 with Vite

## How they fit together

1. The React app signs users in with Supabase Auth (`@supabase/supabase-js`).
2. The React app calls the Spring Boot API, sending the Supabase access token as a Bearer token.
3. Spring Boot validates the token (OAuth2 resource server, Supabase JWKS) and reads and writes the Supabase Postgres database through JPA.
4. The database schema is managed by SQL migrations in `infrastructure/supabase/migrations`.
