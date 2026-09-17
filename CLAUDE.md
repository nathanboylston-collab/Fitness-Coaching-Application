@AGENTS.md

# Coach OS

Next.js (App Router, TS) + Prisma + Supabase (Postgres + Auth), deployed on Vercel.

- Prisma is on v7 (`prisma-client` generator, output at `src/generated/prisma`, gitignored — regenerated via `postinstall`/`prisma generate`). This generator's `PrismaClient` constructor **requires** a driver adapter argument; see `src/lib/prisma.ts` (`@prisma/adapter-pg`). Do not revert to the old zero-arg `new PrismaClient()` pattern from Prisma 5/6.
- CLI config lives in `prisma7.config.ts` (not `prisma.config.ts`), loaded automatically by the Prisma CLI.
- Supabase Auth: `src/lib/supabase/{client,server,middleware}.ts` use the current `getAll`/`setAll` cookie API. Both Coach and Client roles authenticate via Supabase Auth (`auth.users`); app tables store the Supabase `authUserId` (UUID) rather than duplicating auth.
- MVP is being built in phases (see project memory / README "Status"); do not build AI draft-programming-adjustment features until the earlier phases have been validated with real coaches.
