# CloudBase Run Deployment

InsightFlow uses CloudBase Run because the Next.js application includes server-side API routes.

## Service settings

- Service name: `insightflow`
- Access type: `WEB`
- Build context: `03_InsightFlow/05_App`
- Runtime: Dockerfile
- Container port: `3000`
- Health endpoint: `/api/health`
- Development portfolio environment: minimum instances `0`
- Environment: `nova-d6g4wwan76ac55048`
- Deployed version: `insightflow-003`
- Public address: https://insightflow-296013-11-1467319446.sh.run.tcloudbase.com
- Verified runtime mode: Demo Mode

## Runtime environment variables

Configure these in CloudBase Run, never in Docker build arguments or committed files:

```text
AI_PROVIDER=openai-compatible
AI_API_KEY=<server-side secret>
AI_BASE_URL=<OpenAI-compatible endpoint>
AI_MODEL=<model identifier>
```

Without `AI_API_KEY` and `AI_MODEL`, the application remains available in Demo Mode. `/api/health` reports only `demo` or `live`; it never returns credentials.

## CLI deployment

```bash
npm install -g @cloudbase/cli@latest
tcb login
cd 03_InsightFlow/05_App
tcb cloudrun deploy
```

Select the intended CloudBase environment and verify that no unrelated service will be replaced. After deployment, validate `/api/health`, `/dashboard`, and the complete Demo Mode flow.

Deploy from a clean Git archive or clean checkout. The CloudBase CLI packages its `--source` directory before Docker applies `.dockerignore`; do not point it at a working directory containing `.env.local` or build output.
