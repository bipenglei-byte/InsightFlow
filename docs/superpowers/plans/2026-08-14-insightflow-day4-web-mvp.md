# InsightFlow Day 4 Web MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable, clickable InsightFlow Web MVP matching the final Figma language, using unified mock data and real frontend interactions without a real AI backend or database.

**Architecture:** Use Next.js App Router with a shared App Shell, route-level feature screens, reusable product components, and pure domain utilities. Persist the transient create/upload/mapping demo flow in browser storage; keep mock entities and AI lineage centralized so Day 5 can replace adapters without rewriting screens.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui conventions, Lucide React, Recharts, React Hook Form, Zod, Papa Parse, SheetJS, Vitest, pnpm.

---

### Task 1: Scaffold and dependencies

**Files:** Create the Next.js project in `03_InsightFlow/05_App`; create `package.json`, `tsconfig.json`, `components.json`, and configs.

- [ ] Run `pnpm.cmd create next-app@latest 03_InsightFlow/05_App --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --yes` after removing only the placeholder `.gitkeep`.
- [ ] Install `lucide-react recharts react-hook-form @hookform/resolvers zod papaparse xlsx clsx tailwind-merge class-variance-authority @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-slider @radix-ui/react-tooltip`.
- [ ] Install dev dependencies `vitest @types/papaparse` and add `typecheck` plus `test` scripts.
- [ ] Run `pnpm.cmd typecheck` and confirm the untouched scaffold compiles.

### Task 2: Domain contracts and priority logic

**Files:** Create `src/lib/types.ts`, `src/lib/priority.ts`, `src/lib/priority.test.ts`, `src/lib/schemas.ts`.

- [ ] Write failing Vitest cases proving score calculation, clamping, rounding, and P0–P3 boundaries.
- [ ] Run `pnpm.cmd test -- src/lib/priority.test.ts` and confirm failure because utilities do not exist.
- [ ] Implement `calculatePriorityScore()` and `getPriorityFromScore()` as pure functions.
- [ ] Define Feedback, PainPoint, Requirement, Project, Opportunity, PRD, batch, evidence, error, and review types plus Zod form/data schemas.
- [ ] Run the priority tests and confirm they pass.

### Task 3: Unified mock data and demo CSV

**Files:** Create `src/lib/mock-data.ts`, `src/lib/mock-data.test.ts`, `04_Data/demo_feedback.csv`.

- [ ] Write a failing integrity test requiring every visible pain point to reference existing feedback and every requirement to reference an existing pain point.
- [ ] Create NovaNote projects, 100–200 fictional feedback rows, five pain points, five requirements, sentiment series, insights, evidence, and PRD content.
- [ ] Calculate requirement scores through `calculatePriorityScore()` rather than storing authored score constants.
- [ ] Run integrity tests and confirm all lineage checks pass.

### Task 4: Design tokens, UI primitives, and App Shell

**Files:** Modify `src/app/globals.css`, `src/app/layout.tsx`; create `src/components/ui/*`, `src/components/layout/*`, `src/components/shared/*`.

- [ ] Map the exact final Figma neutral, brand, semantic, spacing, radius, border, typography, and shadow tokens to CSS variables.
- [ ] Add shadcn-style Button, Input, Select, Textarea, Sheet, Slider, Tooltip, Badge, Progress, Skeleton, Card, and Table primitives.
- [ ] Build route-aware Sidebar, Topbar, PageHeader, MetricCard, semantic badges, state panels, DataTable, SearchInput, and Filter.
- [ ] Build a responsive AppShell with 240px desktop Sidebar, 64px Topbar, and 32px page padding.
- [ ] Verify `/dashboard` can render a minimal shell without horizontal overflow.

### Task 5: Dashboard and Projects

**Files:** Create `src/app/dashboard/page.tsx`, `src/app/projects/page.tsx`, dashboard chart components.

- [ ] Implement Dashboard header, four KPI cards, Recharts pain points, switchable 7/30/90-day sentiment chart, priority table, and linked AI insight cards.
- [ ] Implement Projects with four statuses, New Project CTA, and empty-state query mode.
- [ ] Confirm all Dashboard and Projects CTAs navigate to valid routes.

### Task 6: Create, upload, and mapping flow

**Files:** Create `src/app/projects/new/page.tsx`, `src/app/projects/new/upload/page.tsx`, `src/app/projects/new/mapping/page.tsx`, `src/lib/file-parser.ts`, flow store utilities.

- [ ] Implement the React Hook Form + Zod project form and persist valid values in sessionStorage.
- [ ] Implement drag/drop and picker parsing for CSV with Papa Parse and XLSX with SheetJS.
- [ ] Enforce extension, 10MB, empty-file, and 5,000-row validation; preserve actionable error messages.
- [ ] Show selected file metadata and parsed preview.
- [ ] Implement required Feedback Content mapping, optional Rating/Date/Source mapping, reactive preview, and disabled Start Analysis until valid.
- [ ] Confirm flow navigation from Create Project through Mapping.

### Task 7: Processing and analysis workspace

**Files:** Create `src/app/processing/page.tsx`, `src/app/projects/[projectId]/analysis/page.tsx`, analysis components.

- [ ] Implement timed pipeline steps with processed count and real state transitions.
- [ ] Add partial failure mode showing 1,239 success and 9 failure, plus a retry action that resolves the failed set.
- [ ] Implement Analysis tabs for Overview, Feedback, Pain Points, Sentiment, and Requirements while reusing Dashboard components.
- [ ] Implement Feedback table and Sheet separating original text from AI structured output.

### Task 8: Pain points, evidence, and requirements

**Files:** Create `src/app/pain-points/[painPointId]/page.tsx`, `src/app/evidence/[painPointId]/page.tsx`, `src/app/requirements/page.tsx`, `src/app/requirements/[requirementId]/page.tsx`.

- [ ] Implement Pain Point detail with metrics, AI summary, breakdown, User Need, Opportunity, and evidence-linked CTA.
- [ ] Resolve Supporting Evidence exclusively from `supportingFeedbackIds` and show original content plus source metadata.
- [ ] Implement Requirements table and detail view.
- [ ] Implement a live Business Value slider that recalculates score and AI recommendation through the shared utility.
- [ ] Implement Manual Priority without removing AI Recommendation, plus Low Confidence and Insufficient Evidence treatments.

### Task 9: PRD workflow

**Files:** Create `src/app/prd/[requirementId]/page.tsx`, PRD editor/export utilities.

- [ ] Render Source Context and the editable PRD Draft side-by-side.
- [ ] Link Source Context back to Supporting Evidence.
- [ ] Implement editable sections, Copy Markdown, and browser Markdown download.
- [ ] Keep Regenerate disabled with the model-configuration tooltip.

### Task 10: State coverage and route QA

**Files:** Add `src/app/states/page.tsx`, `src/app/loading.tsx`, `src/app/error.tsx`, and targeted route components.

- [ ] Add demonstrable Empty Dashboard, Empty Projects, Upload Error, Invalid File, Empty Dataset, Missing Feedback Column, Partial AI Failure, Low Confidence, Insufficient Evidence, Generic Error, skeleton, processing, and button-loading states.
- [ ] Walk the full route flow and fix dead ends, missing back links, and broken CTAs.
- [ ] Check active Sidebar routes, tabs, sheets, slider, copy, and export.

### Task 11: Documentation and final verification

**Files:** Modify `05_App/README.md`; create `05_App/DAY4_REPORT.md`.

- [ ] Document overview, stack, local commands, demo flow, structure, scope, limitations, and Mock AI status.
- [ ] Record pages, components, data architecture, priority logic, evidence traceability, states, Figma QA, engineering QA, limitations, and Day 5 adapters.
- [ ] Run `pnpm.cmd test`, `pnpm.cmd typecheck`, `pnpm.cmd lint`, and `pnpm.cmd build`.
- [ ] Start the production app and use browser QA to inspect the main flow, console, layout, and interactions.
- [ ] Compare representative Web screens with final Figma screenshots and record only observed differences.
