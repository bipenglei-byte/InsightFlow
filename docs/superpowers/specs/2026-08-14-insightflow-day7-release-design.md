# InsightFlow Day 7 Release Design

## 1. Goal

Publish InsightFlow as a public portfolio project through a new public GitHub repository named `InsightFlow`, deploy the runnable Next.js application to Tencent CloudBase Run, and prepare truthful README, demo, and portfolio materials.

## 2. Release Architecture

The existing Next.js application remains the deployable unit. A production Docker image builds and runs `03_InsightFlow/05_App` without moving product, design, AI, evaluation, or portfolio artifacts out of their current structure.

```text
Public GitHub repository
        |
        v
Docker build context: 03_InsightFlow/05_App
        |
        v
Tencent CloudBase Run (public WEB service)
        |
        +--> Demo Mode (no external model required)
        |
        +--> Live AI Mode (server-side CloudBase environment variables)
```

CloudBase static hosting is not used because InsightFlow contains server-side Next.js routes for analysis, retry, opportunity generation, PRD generation, and provider status.

## 3. Repository Design

The existing Git repository remains the local source repository. The public repository is named `InsightFlow`. The public tree keeps `03_InsightFlow` as the project directory so the Day 1–7 artifact taxonomy remains understandable and existing relative references are not destabilized.

The release includes:

- product, design, AI, data, application, demo, and portfolio artifacts;
- source code and lockfile;
- synthetic demo and evaluation data;
- evaluation outputs that are clearly labelled by reviewer type;
- public-safe environment examples and deployment configuration.

The release excludes:

- `.env.local` and every real credential;
- `.next`, `node_modules`, coverage, temporary output, and deployment state;
- private absolute paths, local-only debug artifacts, and accidental logs;
- claims of human review, customer outcomes, deployment, or testing that did not occur.

## 4. CloudBase Run Design

The application is deployed as a containerized WEB service. The container uses a supported Node.js runtime, installs the locked pnpm dependencies, performs a production Next.js build, exposes the platform port, and starts the Next.js server bound to all interfaces.

Production configuration is supplied through CloudBase Run environment variables:

- `AI_PROVIDER`
- `AI_API_KEY`
- `AI_BASE_URL`
- `AI_MODEL`

`AI_API_KEY` is server-side only. It must not be copied into Docker build arguments, public Next.js variables, committed files, screenshots, logs, or documentation. Demo Mode remains usable when Live AI configuration is missing or unavailable.

The initial release uses CloudBase's generated public service URL. Custom domains and automated continuous deployment are follow-up work unless they are already available during deployment.

## 5. GitHub Publication

The first public publication will:

1. normalize repository ignore rules;
2. scan tracked and untracked release files for secrets and private paths;
3. create a clean, intentional commit;
4. create a public GitHub repository named `InsightFlow` under the authenticated user;
5. add the repository as `origin` and push the current release branch;
6. verify repository visibility and README rendering.

If `InsightFlow` already exists, publication must stop before overwriting or force-pushing. No history rewriting or destructive Git operation is allowed.

## 6. Documentation and Demo Assets

The root README is the public technical and recruiter-facing entry point. It explains the problem, workflow, core features, AI architecture, Evidence First traceability, deterministic priority algorithm, evaluation status, setup, deployment, and limitations.

Demo deliverables include a screenshot set when browser capture succeeds, a screenshot plan for any unavailable state, a 60–90 second narration script, shot list, and recording checklist. Screenshots use synthetic NovaNote data and contain no browser chrome, console, credentials, or local paths.

Portfolio deliverables include:

- full case study;
- short case study;
- project-card summary;
- concise AI architecture diagram;
- references to selected real screenshots rather than duplicated assets.

## 7. Truthful Evaluation Presentation

Evaluation claims are read from the existing evaluation artifacts. Quantitative model metrics may be reported when reproducible. The 100-sample qualitative proxy review must be labelled `AI-assisted proxy review`, not human evaluation. The untouched human review sheet remains pending. No productivity improvement or commercial result is claimed without real user evidence.

## 8. Error Handling and Operational Behavior

- Missing AI configuration: application stays available in Demo Mode.
- Provider or model failure: failure remains visible and the existing partial retry path is retained.
- CloudBase build failure: retain logs, diagnose the failing stage, and do not label the app deployed.
- CloudBase runtime failure: inspect service logs and health response before retrying.
- GitHub name collision or permission failure: do not overwrite; report the exact blocker.
- Screenshot failure: create an explicit capture plan instead of fabricated images.

## 9. Verification

Local release checks:

- unit tests;
- TypeScript typecheck;
- ESLint;
- production build;
- Demo Mode main-flow browser test;
- small Live AI smoke test when credentials remain valid;
- secret and private-path scan;
- Markdown link, image, heading, code-fence, and Mermaid checks;
- Docker build and local container health check when Docker is available.

Remote checks:

- public GitHub repository exists and renders correctly;
- CloudBase service returns a successful public response;
- core public routes load;
- Demo Mode completes the main flow;
- server-side secrets are not exposed in HTML, JavaScript, logs, or repository files;
- Live AI status is reported exactly as tested.

## 10. Scope Boundaries

Day 7 does not add authentication, persistence, billing, collaboration, external feedback integrations, a vector database, a custom domain, production monitoring, or new product functionality. It prepares and publishes the existing MVP, its evidence, and its product narrative.

## 11. Completion Criteria

Day 7 is complete only when:

- the public GitHub repository is created and verified;
- the CloudBase Run service is deployed and its URL is verified;
- Demo Mode works on the deployed URL;
- Live AI status is recorded truthfully;
- README, demo materials, portfolio case studies, and Day 7 report exist;
- engineering, functional, security, repository, and documentation QA results are recorded;
- all remaining limitations are explicit.
