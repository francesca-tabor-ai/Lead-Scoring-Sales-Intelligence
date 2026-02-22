# Lead Scoring & Sales Intelligence System (LSSIS)

## Platform Description

*Written by the Product Manager*

**Lead Scoring & Sales Intelligence System (LSSIS)** is a unified platform that helps B2B sales teams prioritize the right leads, allocate budgets intelligently, and maximize conversion ROI — all powered by automated enrichment, NLP signal extraction, and ML-driven scoring.

---

### Our Ideal Customer Profile (ICP)

LSSIS is built for **B2B sales leaders, SDR managers, and revenue operations teams** at SMB and mid-market companies (typically 50–500 employees) who:

- Sell high-consideration products or services (ACVs in the $10K–$100K+ range)
- Manage large lead lists (hundreds to thousands of inbound or purchased leads)
- Run outbound motions where contact costs and time matter
- Need to align sales effort with real pipeline value, not guesswork

These teams often sit in **Technology, SaaS, Fintech, Healthcare, and professional services** — industries where firmographics (revenue, funding, tech stack) and behavioral signals (hiring, expansion, funding announcements) directly predict readiness to buy.

---

### Pain Points We Solve

| Pain Point | Impact |
|------------|--------|
| **Scattered, low-quality leads** | SDRs waste 40–60% of their time on leads that never convert |
| **Manual research and guesswork** | No consistent, scalable way to prioritize who to call first |
| **Blind budget allocation** | Marketing and sales spend without knowing which leads will yield the best ROI |
| **Black-box tools** | Reps don't trust scores they can't explain, so they ignore them |
| **Disconnected data** | Firmographic data, NLP signals, and scores live in different tools and spreadsheets |

LSSIS turns this chaos into a single, transparent workflow: **Import → Enrich → Score → Optimize**.

---

### Why LSSIS Is the Best Solution on the Market

1. **End-to-end pipeline in one place**  
   Web scraping for firmographics, NLP for buying signals (expansion, hiring, funding), and ML scoring — all orchestrated through one UI. No need to stitch together multiple vendors.

2. **Explainable scores**  
   Every lead score comes with **Score Factors** that show *why* it scored high or low. Reps and managers can trust and act on recommendations instead of treating them as opaque numbers.

3. **Budget-aware optimization**  
   The **Budget Optimizer** uses a knapsack-style algorithm to select the best set of leads for a given budget, maximizing expected ROI. Set your budget, run optimization, and get a ranked list of leads plus projected value.

4. **Built for how you work**  
   Import leads from CSV (companyId, name, domain, region, industry, status) and run the pipeline per lead or in bulk. Conversion trends and top-ranked leads surface on the Dashboard for quick decision-making.

5. **No data silos**  
   Company profiles, NLP features, lead scores, and budget allocations are stored together, so you have a single source of truth for lead intelligence.

---

### Expected Results and ROI

| Metric | Expected Impact |
|--------|-----------------|
| **Time-to-prioritization** | 80%+ reduction vs. manual research; pipeline runs in minutes |
| **Conversion rate improvement** | 20–40% lift when reps focus on top-scored leads |
| **Budget efficiency** | Optimization engine targets highest-probability leads within cost constraints |
| **Pipeline predictability** | Expected value per lead and per budget tier visible before outreach |
| **Rep adoption** | Explainable factors increase trust and consistent use of scores |

**Typical ROI:** For a team spending ~$500/lead on pursuit and averaging $10K value per conversion, optimizing budget allocation to top-scored leads can yield **2–4x ROI improvement** vs. random or manual prioritization. The more data you feed (CSV imports + pipeline enrichment), the better the model and the sharper the ROI.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, React Router, TanStack Query, Recharts
- **Backend:** Node.js, Express, tRPC
- **Database:** SQLite + Prisma ORM
- **Key features:** CSV import, web scraping agent, NLP enrichment, ML scoring, budget optimization

## Getting Started

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Then open the app and navigate to **Leads → Import CSV** to load your first list, or use the seeded demo leads.

## Project Structure

- `src/` — React frontend (Dashboard, Leads, Pipeline, Budget, Import CSV)
- `server/` — tRPC API, routers (dashboard, leads, scores, budget, agents)
- `prisma/` — Schema (Lead, CompanyProfile, NLPFeatures, LeadScore, BudgetAllocation, AgentJob)
