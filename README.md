# Kasi24

An accommodation-first platform that helps people discover local stays, compare a shortlist and contact providers directly.

**First-release journey:** Search → Discover → Compare → Connect. The first demo sends enquiries to providers; it does not take bookings or payments.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Java 21, Spring Boot 3, Maven |
| Database and auth | Supabase (PostgreSQL + Supabase Auth) |

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
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Fill in the values from the Supabase dashboard. **Never commit these files.**

### 2. Set up the database

Run `infrastructure/supabase/migrations/*.sql` in the Supabase SQL editor (see [infrastructure/supabase/README.md](infrastructure/supabase/README.md)).

### 3. Run the backend

```bash
cd backend
mvn spring-boot:run
```

The API runs on http://localhost:8080. Check http://localhost:8080/api/health.

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on http://localhost:5173 and forwards `/api` calls to the backend.

## Running tests

```bash
cd backend && mvn test
cd frontend && npm test
```

## Team workflow

See [CONTRIBUTING.md](CONTRIBUTING.md).
