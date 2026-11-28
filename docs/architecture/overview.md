# Architecture overview

```
Browser (React 18 + Vite)
   |  supabase-js (publishable key)            fetch + user JWT
   v                                             v
Supabase Auth / PostgREST  (RLS enforced)   Edge Function `api`
   |                                             |  service role, server side only
   v                                             v
Postgres: public schema (RLS)  <----  private schema (roles, addresses, evidence)
Storage: public-listing-images, listing-image-staging, verification-documents, advertiser-creatives
```

## Rules

1. Pages never import the Supabase client. They call functions in `frontend/src/services/`.
2. Anything that reads or writes the `private` schema or changes status (onboarding, submit, approve/reject) goes through the `api` Edge Function. Routes: `provider/onboard`, `listings`, `listings/<id>/submit`, `listings/<id>/review`, `evidence/<id>/review`, `providers/<id>/review`.
3. The frontend holds only the publishable key. The service_role key exists only as an Edge Function secret.
4. Customers see only approved, available, non-fictional listings and only area-level location. Exact addresses stay private.
5. Schema changes are new files in `backend/supabase/migrations/`; never edit an applied migration.
6. Staff roles (`moderator`, `admin`) are granted in `private.user_roles` by a database admin, never from the app.

## History

The project started with a Java 21 / Spring Boot API in `backend/`. It was replaced by Supabase (see [decision 0002](../decisions/0002-supabase-backend-vercel-hosting.md)), and `backend/` now holds the Supabase project. The Java code is in git history before that change.
