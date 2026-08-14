# InsightFlow

AI User Research & Product Insights Agent — Day 4 interactive Web MVP.

## Overview

InsightFlow turns uploaded feedback into traceable pain points, requirements, priority recommendations, and an editable PRD draft. The current implementation uses unified NovaNote mock data and real frontend interactions; it does not call an AI model or database.

## Tech Stack

Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui conventions, Lucide, Recharts, React Hook Form, Zod, Papa Parse, SheetJS, pnpm.

## Local Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000/dashboard`.

## Demo Flow

Dashboard → New Analysis → Create Project → Upload CSV/XLSX → Field Mapping → AI Processing → Analysis → Pain Point → Supporting Evidence → Requirement → Priority Review → PRD Draft.

Use `../04_Data/demo_feedback.csv` for the upload demo. `/states` provides the principal empty, error, low-confidence, partial-failure, and loading states.

## Project Structure

```text
src/app/                 App Router entry and global tokens
src/components/          App Shell and interactive product screens
src/lib/types.ts         Day 5-ready domain contracts
src/lib/mock-data.ts     Unified NovaNote entities
src/lib/priority.ts      Deterministic priority algorithm
src/lib/schemas.ts       Runtime Zod contracts
```

## Day 4 Scope

- High-fidelity desktop-first UI aligned with the final Figma language
- Real client-side form, upload, parsing, mapping, state, scoring, copy, and export interactions
- Mock AI processing and analysis results
- Evidence lineage through stable feedback IDs

## Current Limitations

- AI analysis and PRD generation use mock data.
- Browser storage is used only for the transient create/upload demo flow.
- There is no authentication, database, collaboration, external integration, or server-side file persistence.
- Regenerate is intentionally disabled until Day 5 model configuration.

## Verification

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

## AI Mode and Live Setup

The app uses transparent Demo Mode when model configuration is absent and Live AI when all required server variables are set. Copy `.env.example` to `.env.local`, then configure `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`, and optionally provider/concurrency settings. Never use a `NEXT_PUBLIC_` AI key.

The Live pipeline is: dataset validation → per-feedback structured analysis → evidence-linked pain-point consolidation → requirement extraction → code-owned priority calculation. Opportunity and PRD generation are separate on-demand API calls. Start live validation at 1, 10, 50, then 100 rows.

In Live AI mode, uploaded feedback may be sent to the configured external AI provider for processing. Without a key, the Day 4 Mock Data flow remains available and is labeled Demo Mode.

Current Day 5 limitations: there is no durable queue or database, live provider behavior has not been tested without credentials, and analysis state remains scoped to the browser session.

## AI Evaluation

The Day 6 runner reuses the production provider, prompts, and Zod schema:

```bash
pnpm eval:v1
pnpm eval:v2
pnpm eval:v3
pnpm eval:feedback --prompt=v2 --dataset=../04_Data/evaluation/evaluation_dataset.csv --output=../04_Data/evaluation
```

Without `AI_API_KEY` and `AI_MODEL`, the runner exits without creating predictions or performance metrics. Human-review fields left blank are excluded from denominators.
