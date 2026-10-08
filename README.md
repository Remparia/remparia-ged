# Remparia GED — landing page

Public landing page for Remparia GED (Next.js App Router), with the founder-circle application form.

## Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL on `localhost:5432`

## Start

```bash
pnpm install
pnpm db:migrate
pnpm dev
```

| Service | URL |
|---------|-----|
| Landing | http://127.0.0.1:5173 |
| API health | http://localhost:8787/health |

`DATABASE_URL` defaults to `postgresql://rempatia:rempatia@localhost:5432/rempatia`.
