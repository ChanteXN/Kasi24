# Kasi24 documentation

| Folder | Contents |
|---|---|
| `requirements/` | Workstream 1 Product & Customer Experience pack: scope, users, use cases (UC-01 to UC-05), user stories and acceptance criteria |
| `design/` | UI/UX screen designs (PDF), logo and branding concepts |
| `design/screens/` | PNG of each screen (01 Landing to 06 Enquiry), one per frontend page |
| `design/branding/` | Logo options, design system and the agreed colour palette |
| `architecture/` | System diagrams, data model, how frontend, backend and Supabase connect |
| `api/` | REST endpoint documentation |
| `decisions/` | Architecture Decision Records: one short file per important technical decision |
| `meeting-notes/` | Team meeting notes, named `YYYY-MM-DD-topic.md` |

## Current API

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | Health check |
| GET | `/api/listings?area=` | Public | Search listings by area (UC-01) |
| GET | `/api/listings/{id}` | Public | Listing details (UC-02) |
| POST | `/api/enquiries` | Public | Send an enquiry to a provider (UC-04) |

## Design note

All sample listing names, prices and areas in the designs and in `infrastructure/supabase/seed.sql` are **fictional** layout examples.
