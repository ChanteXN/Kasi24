# Deployment

| Part | Hosted on | Deployed by |
|---|---|---|
| Frontend (React) | Vercel | GitHub Actions: preview on every PR, production on merge to `main` |
| Backend (database, auth, storage, Edge Function) | Supabase | GitHub Actions on merge to `main` |

Pipeline file: `.github/workflows/ci.yml`

```
PR opened ──► frontend test & build ──► Vercel preview URL
          └─► lint Edge Function

merge to main ──► tests ──► Supabase: db push + deploy `api` ──► Vercel production
```

The frontend deploys **after** the backend so new pages never go live before the database changes they need.

## Accounts

- **Supabase:** no new account per person and no second project. The team shares **one** Supabase project. The owner invites each member: Organization → Team → Invite. Each member signs in with their own free Supabase account to accept.
- **Vercel:** one person (the GitHub repo owner) creates a free Vercel account with GitHub sign-in and owns the Vercel project. Others can be invited later on a team plan, but nobody else needs access for deploys to work.

## One-time setup

### 1. Vercel project

1. Sign in at vercel.com with GitHub → **Add New → Project** → import `ChanteXN/Kasi24`.
2. **Root Directory:** `frontend`. Framework is detected as Vite.
3. **Environment Variables** (Production and Preview):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Deploy once from the dashboard, then copy the IDs: Project → Settings → General shows the **Project ID**, and Account/Team Settings shows the **Team/Org ID**.
5. Account Settings → Tokens → create a token for GitHub Actions.

`frontend/vercel.json` turns off Vercel's own Git auto-deploys so only the pipeline deploys, after tests pass.

### 2. Supabase

1. Supabase dashboard → Account → Access Tokens → generate a token. It must belong to a member of the project's organization.
2. Note the **project ref** (in the project URL, `https://<ref>.supabase.co`) and the **database password**.
3. Set the allowed browser origin for the Edge Function to your Vercel domain:
   ```bash
   supabase secrets set ALLOWED_ORIGIN=https://<your-app>.vercel.app --project-ref <ref>
   ```
4. Supabase → Authentication → URL Configuration: set **Site URL** to the Vercel domain and add it to **Redirect URLs**, so sign-up and password-reset emails link to the live site.

### 3. GitHub secrets

Repository → Settings → Secrets and variables → Actions → **New repository secret**:

| Secret | From |
|---|---|
| `VERCEL_TOKEN` | Vercel token (step 1.5) |
| `VERCEL_ORG_ID` | Vercel Team/Org ID |
| `VERCEL_PROJECT_ID` | Vercel Project ID |
| `SUPABASE_ACCESS_TOKEN` | Supabase access token (step 2.1) |
| `SUPABASE_PROJECT_REF` | Supabase project ref |
| `SUPABASE_DB_PASSWORD` | Supabase database password |

Optional: Settings → Environments → `production` → add required reviewers so production deploys wait for approval.

## Notes

- **Migrations** are skipped until the live schema has been captured with `supabase db pull` (see `backend/README.md`). The Edge Function deploys regardless.
- **Fork PRs** get no secrets, so they get tests but no preview URL. Team members should be added as collaborators and push branches to this repository.
- **Rollback:** frontend → Vercel dashboard → Deployments → pick an earlier one → *Promote to Production*. Database → write a new migration that undoes the change.
