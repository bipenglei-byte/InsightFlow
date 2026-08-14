# InsightFlow Day 7 Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a secure public `InsightFlow` GitHub repository, deploy the working Next.js MVP to Tencent CloudBase Run, and complete truthful README, demo, portfolio, and release-report artifacts.

**Architecture:** Keep the existing artifact tree and Next.js application intact. Add container deployment configuration around `03_InsightFlow/05_App`, publish the repository only after security and documentation QA, deploy the same committed source to CloudBase Run, then verify Demo Mode and record the exact remote status.

**Tech Stack:** Git, GitHub, Next.js 16, TypeScript, pnpm, Docker, Tencent CloudBase CLI / CloudBase Run, Playwright-compatible browser QA, Markdown.

---

### Task 1: Establish the Release Baseline

**Files:**
- Modify: `.gitignore`
- Modify: `03_InsightFlow/05_App/.gitignore`
- Create: `03_InsightFlow/05_App/scripts/release-audit.ps1`
- Test: `03_InsightFlow/05_App/scripts/release-audit.ps1`

- [ ] **Step 1: Inventory repository state and generated files**

Run from the repository root:

```powershell
git status --short --branch
git remote -v
rg --files -g '!**/node_modules/**' -g '!**/.next/**'
```

Expected: current branch and all source/artifact files are visible; no remote exists before publication.

- [ ] **Step 2: Add repository-wide public-release ignore rules**

Create root rules covering environment files, dependencies, Next.js output, coverage, logs, CloudBase/Vercel local state, OS metadata, and temporary QA artifacts. Preserve `03_InsightFlow/05_App/.env.example` with an explicit negation rule.

- [ ] **Step 3: Create a deterministic release audit script**

The PowerShell script must fail when a candidate public file contains any of these classes:

```text
sk-[A-Za-z0-9_-]{16,}
AI_API_KEY=<non-empty value>
C:\Users\
/Users/<name>/
file://
localhost URL in public Markdown
```

It must ignore `.git`, `node_modules`, `.next`, binary screenshots, and `.env.local`, and print a count for scanned files and findings.

- [ ] **Step 4: Run the audit and fix every true positive**

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\03_InsightFlow\05_App\scripts\release-audit.ps1
```

Expected: exit code `0`, `SECRET_FINDINGS=0`, and `PRIVATE_PATH_FINDINGS=0`.

- [ ] **Step 5: Commit the baseline**

```powershell
git add -- .gitignore 03_InsightFlow/05_App/.gitignore 03_InsightFlow/05_App/scripts/release-audit.ps1
git commit -m "chore: add public release guardrails"
```

### Task 2: Add CloudBase Run Container Support

**Files:**
- Create: `03_InsightFlow/05_App/Dockerfile`
- Create: `03_InsightFlow/05_App/.dockerignore`
- Modify: `03_InsightFlow/05_App/next.config.ts`
- Create: `03_InsightFlow/05_App/src/app/api/health/route.ts`
- Create: `03_InsightFlow/05_App/src/app/api/health/route.test.ts`
- Create: `03_InsightFlow/05_App/CLOUDBASE_DEPLOYMENT.md`

- [ ] **Step 1: Write the health-route test**

Test `GET()` directly and assert status `200` plus the stable public payload:

```ts
{
  status: "ok",
  service: "insightflow",
  mode: "demo" | "live"
}
```

- [ ] **Step 2: Run the test and confirm it fails**

```powershell
cd 03_InsightFlow/05_App
pnpm test
```

Expected: failure because the health route does not exist or is not included by the test script.

- [ ] **Step 3: Implement the health route and include route tests**

Return only non-sensitive configuration state. Extend `package.json` test globs so route tests run without exposing provider credentials.

- [ ] **Step 4: Configure a standalone Next.js output**

Set `output: "standalone"` in `next.config.ts` while preserving existing configuration.

- [ ] **Step 5: Create a multi-stage Dockerfile**

Use Node 22 slim/alpine stages, Corepack with pnpm 10.34.5, frozen lockfile installation, `pnpm build`, the standalone server output, `HOSTNAME=0.0.0.0`, and `PORT=3000`. Do not accept AI credentials as build arguments.

- [ ] **Step 6: Add a minimal Docker build context**

Exclude `.env*` except `.env.example`, `.next`, `node_modules`, logs, coverage, artifacts, and local deployment state.

- [ ] **Step 7: Document exact CloudBase Run settings**

Document WEB access, container port `3000`, health path `/api/health`, build context `03_InsightFlow/05_App`, minimum instance recommendation, generated public URL, and server-only environment variables.

- [ ] **Step 8: Verify locally**

```powershell
pnpm test
pnpm typecheck
pnpm lint
pnpm build
docker build -t insightflow:day7 .
```

Expected: all pnpm commands pass; Docker build passes when Docker is installed. If Docker is unavailable, record that exact limitation and rely on CloudBase build verification.

- [ ] **Step 9: Commit deployment support**

```powershell
git add -- 03_InsightFlow/05_App
git commit -m "feat: prepare InsightFlow for CloudBase Run"
```

### Task 3: Produce the Public Root README

**Files:**
- Modify: `03_InsightFlow/README.md`
- Modify: `03_InsightFlow/05_App/README.md`

- [ ] **Step 1: Rewrite the project README for public readers**

Include Overview, Problem, workflow (`Upload → Analyze → Understand → Prioritize → Act`), key features, main user flow, AI processing architecture, Evidence First, deterministic priority formula, Human-in-the-loop, evaluation results, tech stack, screenshots, local setup, Demo/Live modes, deployment, repository structure, portfolio context, limitations, and roadmap.

- [ ] **Step 2: Report evaluation truthfully**

Read metrics from `03_InsightFlow/04_Data/evaluation/*.json`. Label the qualitative result as `AI-assisted proxy review`; state that the blank human review remains pending. Do not claim commercial productivity outcomes.

- [ ] **Step 3: Align the application README**

Document `pnpm install`, `.env.example` copying, `pnpm dev`, test/typecheck/lint/build commands, API routes, Demo Mode, Live AI variables, CloudBase Run, and current limitations.

- [ ] **Step 4: Validate public Markdown**

```powershell
rg -n 'C:\\Users|file://|localhost|PLACEHOLDER|UNFINISHED' 03_InsightFlow/README.md 03_InsightFlow/05_App/README.md
```

Expected: no private paths, placeholders, or public localhost links; localhost may appear only inside fenced local-development commands if clearly labelled.

- [ ] **Step 5: Commit README changes**

```powershell
git add -- 03_InsightFlow/README.md 03_InsightFlow/05_App/README.md
git commit -m "docs: publish InsightFlow project guide"
```

### Task 4: Create Demo Screenshots and Recording Assets

**Files:**
- Create: `03_InsightFlow/06_Demo/screenshots/*.png`
- Create: `03_InsightFlow/06_Demo/SCREENSHOT_PLAN.md`
- Create: `03_InsightFlow/06_Demo/DEMO_SCRIPT.md`
- Create: `03_InsightFlow/06_Demo/DEMO_SHOTLIST.md`
- Create: `03_InsightFlow/06_Demo/DEMO_CHECKLIST.md`

- [ ] **Step 1: Start the production app in Demo Mode**

```powershell
cd 03_InsightFlow/05_App
pnpm build
pnpm start
```

Expected: the local app responds without an AI key and clearly indicates Demo Mode.

- [ ] **Step 2: Capture the ten requested product states**

Use a 1440px desktop viewport and synthetic NovaNote data. Capture dashboard, upload, processing, analysis, pain point, evidence, requirements, priority, PRD, and evaluation where the state actually exists. Use numbered filenames. If a requested state is absent, document it in `SCREENSHOT_PLAN.md` rather than fabricating it.

- [ ] **Step 3: Write the 60–90 second demo script**

For each segment include timecode, screen, user action, voiceover, and on-screen highlight. Tell the product story rather than a development tutorial.

- [ ] **Step 4: Write the shot list and recording checklist**

Each shot records duration, interaction, visual focus, and narrative purpose. The checklist verifies production/demo environment, clean browser, no secrets, 1440p capture, correct mode label, and no console errors.

- [ ] **Step 5: Inspect screenshots**

Verify each image contains real UI data, no browser chrome/debug console, no credential, and readable text.

- [ ] **Step 6: Commit demo assets**

```powershell
git add -- 03_InsightFlow/06_Demo
git commit -m "docs: add InsightFlow demo assets"
```

### Task 5: Write the Portfolio Case Study

**Files:**
- Create: `03_InsightFlow/07_Portfolio/CASE_STUDY.md`
- Create: `03_InsightFlow/07_Portfolio/CASE_STUDY_SHORT.md`
- Create: `03_InsightFlow/07_Portfolio/PROJECT_SUMMARY.md`
- Create: `03_InsightFlow/07_Portfolio/AI_ARCHITECTURE.md`
- Create: `03_InsightFlow/07_Portfolio/assets/README.md`

- [ ] **Step 1: Write the full case study**

Use the required 21-section structure. Explain product reasoning, scope decisions, design, pipeline, evidence traceability, deterministic prioritization, human override, prompt evaluation, actual results, limitations, and lessons. Reference real screenshots with repository-relative paths.

- [ ] **Step 2: Write the short case study**

Produce roughly 800–1200 Chinese characters organized as Problem, Solution, Core UX, AI Architecture, Evaluation, and Result.

- [ ] **Step 3: Write the project summary**

Produce a 200–400 Chinese-character project-card summary covering product, target user, AI role, real outcome, and deliverables without fabricated business metrics.

- [ ] **Step 4: Create the architecture diagram**

Use Mermaid for Feedback → Analyzer → Structured Output → Schema Validation → Pain Point Consolidation → Evidence Mapping → Requirement Extraction → Priority Algorithm → Opportunity/PRD.

- [ ] **Step 5: Validate narrative consistency**

Check that dataset sizes, model name, prompt version, evaluation metrics, reviewer type, implemented features, and limitations match source artifacts.

- [ ] **Step 6: Commit portfolio assets**

```powershell
git add -- 03_InsightFlow/07_Portfolio
git commit -m "docs: add InsightFlow portfolio case study"
```

### Task 6: Complete Local Release QA

**Files:**
- Modify: `03_InsightFlow/05_App/DAY7_REPORT.md`
- Test: all application and public artifact files

- [ ] **Step 1: Run engineering checks**

```powershell
cd 03_InsightFlow/05_App
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

Expected: all commands exit `0`; record exact test count and build routes.

- [ ] **Step 2: Run Demo Mode functional QA**

Exercise Dashboard → Project → Upload → Mapping → Processing → Analysis → Pain Point → Evidence → Requirement → Priority → PRD. Verify CTAs, route changes, drawers, slider recalculation, manual override, copy/export, retry, and browser console.

- [ ] **Step 3: Run a cost-bounded Live AI smoke test**

Use 10–20 synthetic feedback items only. Verify analysis, evidence IDs, requirements, and PRD generation. Never print the API key. If provider access fails, record the exact failure and leave Demo Mode unaffected.

- [ ] **Step 4: Run security and documentation audits**

Run the release audit, `git check-ignore 03_InsightFlow/05_App/.env.local`, inspect Markdown links/images, and verify no tracked build output or temporary files.

- [ ] **Step 5: Draft the Day 7 report with pre-deployment facts**

Fill Goal, Production Readiness, Demo Mode, Live AI Status, GitHub Cleanup, Security Check, Root README, Demo Assets, Portfolio Case Study, QA, Known Limitations, and Remaining Work. Leave Deployment URL explicitly `Pending deployment` until verified.

- [ ] **Step 6: Commit the verified release candidate**

```powershell
git add -- 03_InsightFlow/05_App/DAY7_REPORT.md
git commit -m "docs: record InsightFlow Day 7 QA"
```

### Task 7: Create and Publish the Public GitHub Repository

**Files:**
- Modify: Git remote configuration
- Verify: public GitHub `InsightFlow` repository

- [ ] **Step 1: Confirm GitHub identity and repository availability**

Use the connected GitHub account or authenticate GitHub CLI. Check whether `InsightFlow` already exists. Stop before mutation if a repository with that name exists and is not this project.

- [ ] **Step 2: Create the public repository**

Create `InsightFlow` with public visibility and no generated README, license, or `.gitignore`, because the local repository is authoritative.

- [ ] **Step 3: Add the remote and push safely**

```powershell
git remote add origin <authenticated-repository-url>
git push -u origin main
```

Expected: push succeeds without force; `origin/main` points at the locally verified release commit.

- [ ] **Step 4: Verify GitHub rendering and secrecy**

Open the public repository, confirm README, Mermaid, relative links, screenshots, and directory navigation. Search the public repository for environment values and private paths.

### Task 8: Deploy the Committed Release to CloudBase Run

**Files:**
- Modify: `03_InsightFlow/05_App/DAY7_REPORT.md`
- Remote state: Tencent CloudBase Run service `insightflow`

- [ ] **Step 1: Install and authenticate CloudBase CLI**

```powershell
npm install -g @cloudbase/cli@latest
tcb login
```

Expected: device/browser authorization completes without placing Tencent credentials in the repository.

- [ ] **Step 2: Select the target CloudBase environment**

List accessible environments, select the user-owned target environment, and record only its non-secret environment ID in the deployment report/configuration.

- [ ] **Step 3: Create or update the WEB service**

From `03_InsightFlow/05_App`, deploy the Dockerfile as service `insightflow`, public WEB access, container port `3000`, and health path `/api/health`. Do not delete or overwrite another unrelated service.

- [ ] **Step 4: Configure server-side runtime variables**

Set `AI_PROVIDER`, `AI_BASE_URL`, `AI_MODEL`, and `AI_API_KEY` through CloudBase Run secrets/environment settings. Never pass them as Docker build arguments or commit them.

- [ ] **Step 5: Wait for a healthy revision**

Inspect build and runtime status until success or a concrete failure appears. If the service is not healthy, inspect logs, fix the scoped cause, rebuild, and redeploy.

- [ ] **Step 6: Verify the public URL**

Check `/api/health`, `/dashboard`, upload/mapping, Demo Mode analysis, evidence, requirement priority, and PRD. Verify the served client contains no API key. Run a small Live AI check only if the configured provider is healthy.

- [ ] **Step 7: Record verified deployment facts**

Replace `Pending deployment` in `DAY7_REPORT.md` with the actual CloudBase URL, revision status, Demo Mode outcome, Live AI outcome, and deployment limitations.

### Task 9: Finalize and Synchronize the Public Release

**Files:**
- Modify: `03_InsightFlow/README.md`
- Modify: `03_InsightFlow/05_App/DAY7_REPORT.md`
- Verify: GitHub and CloudBase production

- [ ] **Step 1: Add the verified deployment URL**

Add the actual CloudBase URL to README and Day 7 report only after successful public validation.

- [ ] **Step 2: Re-run the complete release gate**

```powershell
cd 03_InsightFlow/05_App
pnpm test
pnpm typecheck
pnpm lint
pnpm build
cd ../..
powershell -ExecutionPolicy Bypass -File .\03_InsightFlow\05_App\scripts\release-audit.ps1
git status --short
```

Expected: all checks pass, audit findings are zero, and only intentional final documentation changes remain.

- [ ] **Step 3: Commit and push final verified documentation**

```powershell
git add -- 03_InsightFlow/README.md 03_InsightFlow/05_App/DAY7_REPORT.md
git commit -m "docs: publish verified InsightFlow deployment"
git push origin main
```

- [ ] **Step 4: Perform final remote QA**

Confirm GitHub shows the final commit and CloudBase remains healthy. Record exact test results, URLs, screenshots created, Live AI status, and real limitations in the completion report.
