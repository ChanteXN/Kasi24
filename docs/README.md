# Kasi24 documentation

| Path | Contents |
|---|---|
| `requirements/` | Workstream 1 Product & Customer Experience pack: scope, users, use cases (UC-01 to UC-05), user stories and acceptance criteria |
| `design/` | UI/UX screen designs (PDF), logo and branding concepts |
| `design/screens/` | PNG of each original screen design (01 Landing to 06 Enquiry) |
| `design/branding/` | Logo options, design system and the agreed colour palette |
| `architecture/overview.md` | How the frontend, Supabase and the Edge Function connect, and the security rules |
| `deployment.md` | Vercel + Supabase hosting, CI/CD pipeline, secrets, rollback |
| `api/` | API notes. The Edge Function routes are listed in [backend/README.md](../backend/README.md) |
| `decisions/` | Architecture Decision Records: one short file per important technical decision |
| `meeting-notes/` | Team meeting notes, named `YYYY-MM-DD-topic.md` |
| `archive/` | Superseded material kept for reference only |

## Design note

All sample listing names, prices, ratings and areas in the designs are **fictional** layout examples. Do not present them as real listings or market prices.

The Workstream 1 pack describes the first concept (short stays, enquiries without an account). The product has since moved to monthly rentals in Khayelitsha with signed-in enquiries and provider verification. The code and `architecture/overview.md` describe the current product.
