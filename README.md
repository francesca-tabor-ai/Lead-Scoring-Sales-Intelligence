# LSSIS — Lead Scoring & Sales Intelligence System

A full-stack B2B lead scoring and sales intelligence platform with agents, tRPC API, and React dashboard.

## Stack

- **Frontend:** React, Vite, TypeScript, tRPC, TanStack Query, React Router, Recharts
- **Backend:** Express, tRPC, Prisma, SQLite
- **Agents:** Web Scraper, NLP Enrichment (with optional OpenAI), Scoring, Budget Allocation

## Quick Start

```bash
npm install
npm run db:seed    # Seed 15 demo leads
npm run dev        # Start API (3001) + Vite (5173)
```

Open http://localhost:5173 (or the port Vite reports).

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start API + frontend |
| `npm run client` | Frontend only |
| `npm run server` | API only |
| `npm run db:seed` | Seed demo data |
| `npm run test` | Run Vitest tests |
| `npm run build` | Build for production |

## Features

- **Dashboard** — KPIs, conversion trends, top ranked leads
- **Leads** — CRUD, filters, CSV import (paste or file upload)
- **Lead Detail** — Profile, NLP signals, score, explainability
- **Scoring Pipeline** — Run scraper → NLP → scoring per lead or full pipeline
- **Budget Optimizer** — ROI projections, cost vs value charts, allocation
- **Admin** — Model metrics, retrain, system config

## Optional: Real LLM for NLP

Set `OPENAI_API_KEY` to use GPT-4o-mini for NLP signal extraction:

```bash
OPENAI_API_KEY=sk-... npm run dev
```

Without the key, the NLP agent uses simulated signals.

## CSV Import

Use **Leads → Import CSV** with columns: `companyId`, `name`, `domain`, `region`, `industry`, `status` (optional).

## Database

SQLite at `prisma/dev.db`. Reset and reseed:

```bash
npx prisma db push --force-reset
npm run db:seed
```
