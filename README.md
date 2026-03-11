# ShiftBoard — Smart Shift Scheduling

A mobile-first scheduling system for reserve duty / shift management. Replaces the Google Form + Excel workflow.

## Features

- **One shared link** — Manager sends a single weekly link to the WhatsApp group
- **Soldier form** — Mobile-friendly availability submission (no login required)
- **Auto-lookup** — Returning soldiers identified by personal number, existing data loaded
- **Manager dashboard** — Summary stats, response table, share link
- **Recommendation engine** — Rules-based auto-assignment considering availability, constraints, and fairness
- **Drag-and-drop board** — Jira/Trello-style schedule builder with role lanes
- **Mobile schedule view** — Screenshot-ready published schedule for WhatsApp

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui-inspired components
- @dnd-kit for drag and drop
- React Hook Form + Zod for validation
- In-memory database (Supabase-ready schema included)

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

The app auto-seeds with demo data: 1 sample week, 5 roles, 20 soldiers, 12 pre-filled submissions.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with demo links |
| `/week/[weekId]` | Soldier availability form (shared link) |
| `/week/[weekId]/schedule` | Published schedule (mobile view) |
| `/manager` | Manager week list |
| `/manager/week/[weekId]` | Manager dashboard + schedule board |

## Project Structure

```
src/
├── app/api/          # API routes
├── components/
│   ├── ui/           # Reusable UI primitives
│   ├── soldier/      # Soldier form components
│   ├── manager/      # Manager dashboard components
│   └── board/        # DnD board components
├── db/
│   ├── types.ts      # TypeScript types
│   └── store.ts      # In-memory database
└── lib/
    ├── utils.ts
    └── recommendation-engine.ts
```

## Database

SQL schema for Supabase: `supabase/schema.sql`
