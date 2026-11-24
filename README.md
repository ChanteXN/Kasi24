# Kasi24

An accommodation-first platform that helps people discover local stays, compare a shortlist and contact providers directly.

**First-release journey:** Search → Discover → Compare → Connect. The first demo sends enquiries to providers; it does not take bookings or payments.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Supabase: PostgreSQL + Row Level Security, Auth, Storage and the `api` Edge Function |
| Legacy prototype | Java 21 / Spring Boot API in `backend/` (not used by the frontend any more) |

## Repository structure

```
Kasi24/
├── backend/                 Spring Boot REST API
│   └── src/main/java/com/kasi24/
│       ├── config/          App configuration (CORS, beans)
│       ├── controller/      REST endpoints
│       ├── dto/             request/ and response/ objects sent over the API
│       ├── entity/          JPA entities mapped to database tables
│       ├── exception/       Custom exceptions + global error handler
│       ├── mapper/          Entity <-> DTO conversion
│       ├── repository/      Spring Data JPA repositories
│       ├── security/        Spring Security + Supabase JWT validation
│       ├── service/         Business logic interfaces (impl/ for implementations)
│       └── util/            Shared helpers and constants
├── frontend/                React app
│   └── src/
│       ├── components/      Reusable UI (common/, layout/, listings/)
│       ├── pages/           One page per screen design
│       ├── routes/          React Router setup
│       ├── services/        Calls to the backend API
│       ├── context/         Auth and other shared state
│       ├── hooks/           Custom React hooks
│       ├── lib/             Supabase client
│       ├── styles/          Global CSS and brand colours
│       └── utils/           Helpers
├── infrastructure/
│   ├── supabase/            SQL migrations and seed data
│   ├── docker/              Dockerfiles and docker-compose
│   └── scripts/             Dev and deployment scripts
├── tests/                   End-to-end, integration and performance tests
├── docs/                    Requirements, designs, architecture, decisions, meeting notes
└── .github/                 CI workflow, PR and issue templates
```

## Getting started

### Prerequisites

- Java 21
- Maven 3.9+ (or the Maven bundled with IntelliJ IDEA)
- Node.js 20+
- Access to the team Supabase project

### 1. Configure environment

```bash
cp frontend/.env.example frontend/.env.local
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from the Supabase dashboard (Project Settings > API). **Never commit this file**, and never put the service_role/secret key in it.

### 2. Database

The KASI24 Supabase project already has the production schema, policies and Edge Function. See [infrastructure/supabase/README.md](infrastructure/supabase/README.md) before running any SQL.

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on http://localhost:5173 and talks to Supabase directly.

### Quick start on Windows (PowerShell)

```powershell
cd C:\2026\MPP
git clone https://github.com/DeekayMadavha/Kasi24.git
cd Kasi24
git checkout develop            # integration branch; branch off it for new work
cd frontend
Copy-Item .env.example .env.local
notepad .env.local              # fill in the two VITE_SUPABASE_* values (Supabase dashboard > Project Settings > API)
npm install
npm run dev                     # http://localhost:5173
```

Restart `npm run dev` after editing `.env.local`; Vite only reads it at startup. Check your Node version with `node -v` (20+ needed).

## Running tests

```bash
cd backend && mvn test
cd frontend && npm test
```

## Team workflow

See [CONTRIBUTING.md](CONTRIBUTING.md).
