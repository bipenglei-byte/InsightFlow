# InsightFlow Day 7 Report

## 1. Goal

Prepare InsightFlow for a public GitHub release and Tencent CloudBase Run deployment, then package the product story for demo and portfolio use.

## 2. Production Readiness

- Next.js standalone output configured
- Multi-stage Dockerfile and minimal Docker context added
- Public `/api/health` endpoint added; it exposes only service status and Demo/Live mode
- Root/app ignore rules and deterministic release audit added
- Demo Mode remains the no-credential fallback

## 3. Deployment

Status: deployed successfully to Tencent CloudBase Run. Service `insightflow`, version `insightflow-002`, receives 100% of traffic in environment `nova-d6g4wwan76ac55048`.

## 4. Deployment URL

https://insightflow-296013-11-1467319446.sh.run.tcloudbase.com

Public checks returned HTTP 200 for `/api/health`, `/dashboard`, `/requirements`, `/prd/search-optimization`, and `/states`.

## 5. Demo Mode

Local and deployed routes were verified. Demo Mode requires no external provider and covers the Upload-to-PRD flow. The deployed health endpoint reports `mode: demo`.

## 6. Live AI Status

The existing OpenAI-compatible pipeline and Day 6 evaluations use SiliconFlow with `Qwen/Qwen3.5-4B`. CloudBase does not currently contain the provider runtime variables, so the public service truthfully remains in Demo Mode. The previously shared key should be rotated before a new secret is entered in the CloudBase console.

## 7. GitHub Cleanup

- Public root README created
- Repository-level ignore rules created
- Build output, dependencies, environment files, logs, and deployment state excluded
- Public GitHub repository published at https://github.com/bipenglei-byte/InsightFlow

## 8. Security Check

Final release audit result: 138 text files scanned, 0 secret findings, 0 private-path findings. `.env.local` is ignored and the successful deployment used a clean Git archive, excluding local environment files and build output. The previously shared provider key should be rotated because it appeared in chat history.

## 9. Root README

The public README documents the problem, workflow, product principles, AI architecture, Evidence First, priority logic, evaluation, local setup, demo/live modes, and limitations.

## 10. Demo Assets

Ten local screenshots were generated from real application routes at a 1440px viewport. A screenshot plan records the route and visual focus for each image.

## 11. Demo Video Script

An 80-second product-demo script, ten-shot shot list, and recording checklist are available in `06_Demo`.

## 12. Portfolio Case Study

The full case study, short case study, project summary, and AI architecture diagram are available in `07_Portfolio`.

## 13. QA

- Unit tests: 16/16 passed
- TypeScript: passed
- ESLint: passed
- Next.js production build: passed; 9 routes generated, including `/api/health`
- Screenshot generation: 10 files created
- Release audit: passed
- Docker CLI: installed; the local Docker Desktop Linux engine was unavailable
- CloudBase remote Docker build: passed and deployed successfully

## 14. Known Limitations

- Public deployment currently runs in Demo Mode; CloudBase Live AI secrets are not configured
- The previously shared AI key should be rotated before production use
- Human qualitative evaluation and PRD review remain pending
- Confidence is not calibrated; clustering remains MVP-level
- No production persistence, durable queue, authentication, or customer usage data

## 15. Public Repository Readiness

The repository is public at https://github.com/bipenglei-byte/InsightFlow and the application is deployed to CloudBase Run.

## 16. Remaining Work

1. Rotate the previously shared AI provider key.
2. Add the rotated secret and non-secret provider variables in the CloudBase service configuration when Live AI is required.
3. Complete the pending human qualitative evaluation and PRD review.

## 17. Chinese Interface Release

- Global navigation, dashboard, projects, upload, field mapping, processing, analysis, pain points, evidence, requirements, priority review, opportunities, PRD, empty states, loading states, and error states are localized in Simplified Chinese.
- Domain enum values remain unchanged in APIs, schemas, storage, and tests; the UI uses centralized Chinese display mappings.
- Mock summaries, insights, pain points, requirements, opportunities, and PRD content are Chinese.
- Uploaded feedback and `originalText` remain untouched to preserve Evidence First traceability.
- Live AI prompts request Simplified Chinese descriptive fields while retaining controlled enum values and feedback IDs.
- Browser QA covered 13 routes at 1440px: 0 forbidden English UI strings and 0 detected layout overflows.
- Ten Chinese demo screenshots were regenerated.
- CloudBase version `insightflow-003` was deployed with 100% traffic. `/api/health`, `/dashboard`, `/requirements`, `/prd/search-optimization`, and `/states` returned HTTP 200 and their expected Chinese markers.
