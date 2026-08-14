# Model Configuration

- OpenAI-compatible HTTP API behind `AIProvider`.
- Variables: `AI_PROVIDER`, `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`; optional `AI_BATCH_SIZE`, `AI_CONCURRENCY`, `AI_TIMEOUT_MS`.
- Temperature: 0.1 for classification; 0.2 for opportunity and PRD.
- JSON output is followed by Zod validation and up to two corrective retries.
- Model input is normalized and capped at 4,000 characters; original evidence is retained.
- Concurrency defaults to 3. Validate at 1, 10, 50, then 100 rows.
- Token fields are optional and cost is never inferred.
- No `NEXT_PUBLIC_` secret is supported.
