# Kasi24

A local accommodation marketplace for Khayelitsha (Site B/C). People search for rooms to rent, compare options and contact verified providers. Providers list their rooms, and staff moderate listings before they go live.

**First-release journey:** Search → Discover → Compare → Connect. Enquiries go to providers; the app does not take bookings or payments.

[![CI/CD](https://github.com/ChanteXN/Kasi24/actions/workflows/ci.yml/badge.svg)](https://github.com/ChanteXN/Kasi24/actions/workflows/ci.yml)

## Tech stack

| Layer | Technology | Hosted on |
|---|---|---|
| Frontend | React 18 + Vite | Vercel |
| Backend | Supabase: PostgreSQL + Row Level Security, Auth, Storage, Edge Function (`api`) | Supabase |
| CI/CD | GitHub Actions | GitHub |

## Repository structure

```
Kasi24/
├── frontend/                    React app (deployed to Vercel)
│   ├── src/
│   │   ├── components/          Reusable UI (common/, layout/, listings/)
│   │   ├── pages/               One page per screen
│   │   ├── routes/              React Router setup
│   │   ├── services/            All Supabase / Edge Function calls (pages never call Supabase directly)
│   │   ├── context/             Auth and other shared state
│   │   ├── hooks/               Custom React hooks
│   │   ├── lib/                 Supabase client
│   │   ├── styles/              Global CSS and brand colours
│   │   └── utils/               Helpers
│   └── vercel.json              Vercel build, routing and headers
├── backend/                     Supabase backend - see backend/README.md
│   └── supabase/
│       ├── config.toml          Supabase CLI config
│       ├── migrations/          Database schema changes
│       └── functions/api/       Edge Function for trusted workflows
├── infrastructure/              Optional Docker setup and helper scripts
├── tests/                       End-to-end, integration and performance tests
├── docs/                        Requirements, designs, architecture, deployment, decisions
└── .github/                     CI/CD pipeline, PR and issue templates
```

## Getting started

### Prerequisites

- Node.js 20+
- Git (on Windows also run `git config --global core.longpaths true`)
- An invite to the team Supabase project (ask the project owner)

### Run the app

```bash
git clone https://github.com/ChanteXN/Kasi24.git
cd Kasi24
git checkout develop
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

On Windows PowerShell use `Copy-Item .env.example .env.local` instead of `cp`.

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local` from Supabase (Project Settings → API). Never commit this file, and never put the service_role/secret key in it. Restart `npm run dev` after editing it.

The app runs on http://localhost:5173 and talks to Supabase directly.

### Backend

The shared Supabase project already has the schema, policies and Edge Function. Read [backend/README.md](backend/README.md) before running any SQL or CLI command against it.

## Tests

```bash
cd frontend
npm test
```

## Deployment

Merging to `main` deploys Supabase changes and then the frontend to Vercel. Every pull request gets a Vercel preview link. Setup and required secrets: [docs/deployment.md](docs/deployment.md).

## Team workflow

See [CONTRIBUTING.md](CONTRIBUTING.md).
