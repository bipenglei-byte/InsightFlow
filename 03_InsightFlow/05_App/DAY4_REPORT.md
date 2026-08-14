# InsightFlow Day 4 Report

## 1. Goal

Implement the final Figma design language as a clickable Web MVP using mock AI data and real frontend logic.

## 2. Implemented Pages

Dashboard, Projects, Create Project, Upload Dataset, Field Mapping, AI Processing, Analysis workspace, Feedback detail, Pain Point Detail, Supporting Evidence, Requirements, Requirement Detail, PRD Generator, and Product States.

## 3. Implemented Components

Shared App Shell, route-aware Sidebar, Topbar, Page Header, Metric Card, semantic Badge, Card, Table, Tabs, state panels, progress bars, charts, form controls, upload dropzone, preview table, Feedback detail panel, priority breakdown, and PRD editor.

## 4. Main User Flow

Dashboard → Create Project → Upload → Mapping → Processing → Analysis → Pain Point → Evidence → Requirement → Priority Review → PRD Draft. Each primary CTA has a valid route; direct Evidence and Requirement paths remain available from analysis objects.

## 5. Functional Interactions

- 7/30/90-day sentiment state changes
- React Hook Form + Zod project validation
- CSV/XLSX drag/drop and file picker parsing
- File type, size, empty-data, and row-count validation
- Reactive field mapping preview
- Timed processing pipeline and partial-failure retry
- Analysis tabs and feedback structured-output detail
- Business Value slider with immediate deterministic recalculation
- Manual Priority Override preserving AI Recommendation
- Editable PRD, clipboard copy, and Markdown download

## 6. Mock Data Architecture

`src/lib/mock-data.ts` owns the NovaNote demo entities. Screens resolve relations by IDs rather than duplicating content. `src/lib/types.ts` and `src/lib/schemas.ts` form the future API boundary.

## 7. Priority Algorithm

`src/lib/priority.ts` implements the documented weighted formula, clamps inputs to 0–100, rounds the result, and maps it to P0–P3. UI code does not duplicate the formula.

## 8. Evidence Traceability

Every visible Pain Point owns `supportingFeedbackIds`. Supporting Evidence resolves those IDs to original feedback text and source metadata. Insufficient Evidence is represented as a blocking state.

## 9. Error / Loading States

The demo covers Empty Dashboard, Empty Projects, Upload Error, Invalid File, Empty Dataset, Missing Feedback Column, Partial Failure, Low Confidence, Insufficient Evidence, Generic Not Found, skeleton, processing, and button loading/disabled states.

## 10. Figma Design QA

Implementation maps the final 240px Sidebar, 64px Topbar, 32px content padding, neutral canvas, restrained brand blue, 8px cards, 1px borders, dense tables, semantic badges, and evidence-forward layouts. The Web app is responsive below desktop width, while Figma remains the 1440px reference.

Recorded design differences:

- The Web feedback detail uses an overlay panel; final Figma primarily shows a dedicated Feedback Analysis screen.
- Early PRD language described an Evidence drawer; the final Figma and Web both use a dedicated Supporting Evidence view.
- The final Figma has 12 concrete screens while the PRD groups the same scope into 8 main information-architecture pages.

## 11. Engineering QA

Observed results on 2026-08-14:

- `pnpm test`: 3/3 Priority Algorithm tests passed.
- `pnpm typecheck`: passed with no TypeScript errors.
- `pnpm lint`: passed with no ESLint errors or warnings.
- `pnpm build`: Next.js 16.3.1 production build completed successfully.
- Browser QA: complete primary flow passed at 1440 × 1080 with no captured console or page errors.

## 12. Build Status

Production build verified successfully. App Router exposes the dynamic `[[...slug]]` route and Next.js generated the expected production output.

## 13. Known Limitations

- Processing is a timed mock and does not survive a hard refresh.
- Uploaded data remains in sessionStorage and is not sent to a server.
- Mock dataset entities represent the demo flow; uploaded rows are used for preview/mapping, not actual AI analysis.
- Regenerate is disabled because no model is configured.

## 14. Day 5 Integration Points

- Replace `mock-data.ts` reads with typed API adapters.
- Submit parsed/mapped rows to the real analysis batch endpoint.
- Stream or poll `AnalysisBatchSummary` into the Processing UI.
- Replace mock Feedback Analysis, Pain Point, Requirement, Opportunity, and PRD entities with schema-validated responses.
- Persist review overlays, Business Value, and Manual Priority separately from AI originals.
- Keep `priority.ts` deterministic on the application/server side.
