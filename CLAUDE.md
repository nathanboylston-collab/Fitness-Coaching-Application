@AGENTS.md

# Coach OS

Next.js (App Router, TS) + Prisma + Supabase (Postgres + Auth), deployed on Vercel.

- Prisma is on v7 (`prisma-client` generator, output at `src/generated/prisma`, gitignored — regenerated via `postinstall`/`prisma generate`). This generator's `PrismaClient` constructor **requires** a driver adapter argument; see `src/lib/prisma.ts` (`@prisma/adapter-pg`). Do not revert to the old zero-arg `new PrismaClient()` pattern from Prisma 5/6.
- CLI config lives in `prisma7.config.ts` (not `prisma.config.ts`), loaded automatically by the Prisma CLI.
- Supabase Auth: `src/lib/supabase/{client,server,middleware}.ts` use the current `getAll`/`setAll` cookie API. Both Coach and Client roles authenticate via Supabase Auth (`auth.users`); app tables store the Supabase `authUserId` (UUID) rather than duplicating auth.
- MVP is being built in phases (see project memory / README "Status"); do not build AI draft-programming-adjustment features until the earlier phases have been validated with real coaches.
- Next.js 16 renamed `middleware.ts`/`export function middleware` to **`proxy.ts`/`export function proxy`** (same behavior, new names — `middleware.ts` still "works" in the sense that the build accepts it, but silently never runs). This project uses a `src/` layout, so the file **must live at `src/proxy.ts`**, not the project root — Next's own docs say "If you're using Proxy, ensure it is placed inside the `src` folder," and placing it at the root here caused it to be silently inert (routes it should have guarded returned 200 instead of redirecting) until moved. If auth-gated routes ever start rendering for logged-out users again, check this first. The actual session-refresh/redirect logic lives in `src/lib/supabase/middleware.ts` (an ordinary helper module, not the special convention file) and is imported by `src/proxy.ts`.
