# Coach OS

A lightweight "Coach OS" for independent fitness coaches: manage clients, run
weekly check-ins, and use AI to speed up (never replace) the coach's review
and programming decisions.

## Stack

- Next.js (App Router) + TypeScript
- PostgreSQL via [Supabase](https://supabase.com) (also provides Auth)
- Prisma ORM
- Anthropic API (AI check-in summaries — added in a later phase)
- Resend (email — added in a later phase)
- Deployed on Vercel

## Local setup

1. Create a free [Supabase](https://supabase.com) project.
2. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Project Settings -> API.
   - `DATABASE_URL` — Project Settings -> Database -> Connection string (use the **Transaction pooler**, port 6543).
3. Install dependencies and apply the schema:

   ```bash
   npm install
   npx prisma migrate dev --name init
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000`, sign up as a coach, and confirm you land on `/dashboard`.

## Project structure

- `prisma/schema.prisma` — data model (Coach, Client, ClientProfile, Program/ProgramWeek/Workout/ExercisePrescription, CheckIn, CheckInSummary, etc.)
- `src/lib/supabase/` — Supabase client helpers (browser, server, middleware) for auth
- `src/lib/prisma.ts` — Prisma client singleton
- `src/app/(login|signup)/` — coach auth flows
- `src/app/dashboard/` — protected coach dashboard shell

## Status

Phase 1 (foundations: scaffold, schema, coach auth, deploy pipeline) is in
progress. See project memory / conversation history for the full phased MVP
plan.
