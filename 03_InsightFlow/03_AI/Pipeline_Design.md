# InsightFlow AI Pipeline

## Goals and Architecture
The server-only provider layer calls an OpenAI-compatible API. The orchestrator normalizes input, runs controlled-concurrency analysis, validates structured output, consolidates pain points, extracts requirements, and calls the existing priority algorithm.

## Provider and Structured Output
`AIProvider` isolates model vendors. Every response is parsed and validated by Zod. Configuration uses server environment variables only.

## Feedback and Batch Processing
Each item uses controlled vocabulary, a severity rubric, underlying need, and self-assessed confidence. Concurrency defaults to 3; an item retries twice and its failure does not abort successful work.

## Pain Points and Evidence
The model groups only closely related product areas, problems, and needs. Every cluster contains real `supportingFeedbackIds`; code calculates counts, share, negative rate, and severity.

## Requirements and Priority
Requirements derive from underlying needs. Frequency, severity, and the weighted priority score are code-owned. Business value and final override remain PM-owned.

## Opportunity and PRD
Both are generated on demand, outside the main batch. PRDs cite real evidence IDs and may suggest metrics without inventing baselines.

## Errors and Telemetry
Safe states cover configuration, timeout, rate-limit, parse/schema, provider, and partial failures. Telemetry records timestamps, duration, counts, provider, model, mode, and prompt versions; token use is recorded only if provided.

## Demo / Live AI Mode
Missing configuration selects Demo Mode. Complete server configuration selects Live AI. Demo data remains available.
