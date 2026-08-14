# InsightFlow Web Application

Runnable Next.js implementation of the InsightFlow AI user-research and product-insight MVP.

## Commands

```bash
pnpm install
pnpm dev
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm audit:release
```

The product route is `/dashboard`; `/states` displays representative empty, error, partial-failure, low-confidence, insufficient-evidence, and loading states.

## Product Flow

Dashboard → New Analysis → Create Project → Upload CSV/XLSX → Field Mapping → AI Processing → Analysis → Pain Point → Supporting Evidence → Requirement → Priority Review → Opportunity → PRD Draft.

## Runtime Modes

Copy `.env.example` to `.env.local`. When `AI_API_KEY` and `AI_MODEL` are absent, the application uses transparent Demo Mode. Live AI uses server-only `AI_PROVIDER`, `AI_API_KEY`, `AI_BASE_URL`, and `AI_MODEL`; never expose the key with a `NEXT_PUBLIC_` name.

The production pipeline performs dataset validation, per-feedback structured analysis, Zod validation, evidence-linked pain-point consolidation, requirement extraction, deterministic priority scoring, and on-demand Opportunity/PRD generation. `/api/health` returns only service health and `demo`/`live` mode.

## Data and Evaluation

Synthetic demo data lives in `../04_Data`. The Day 6 runner reuses production prompts, provider, and schemas:

```bash
pnpm eval:v1
pnpm eval:v2
pnpm eval:v3
pnpm eval:compile
```

Qualitative proxy scores are labelled `AI_PROXY`; the blank human-review form remains separate.

## Deployment

The production build uses Next.js standalone output and a multi-stage Dockerfile for Tencent CloudBase Run. See [CLOUDBASE_DEPLOYMENT.md](./CLOUDBASE_DEPLOYMENT.md).

## Structure

```text
src/app/          App Router pages and APIs
src/components/   App shell and reusable product views
src/lib/          Domain types, mock/live data, AI pipeline, evaluation
scripts/          QA, evaluation, and release audit
Dockerfile        CloudBase Run container
```

## Limitations

- No authentication, production database, durable queue, or team workspace
- Browser-scoped demo state and MVP-level clustering
- Live provider behavior depends on external service availability and cost limits
- Human qualitative evaluation and PRD review remain pending
