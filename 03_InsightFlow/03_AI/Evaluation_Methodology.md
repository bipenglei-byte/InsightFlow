# InsightFlow Evaluation Methodology

## Ground Truth and Dataset

`evaluation-dataset-v1` contains 100 synthetic, privacy-safe NovaNote feedback samples manually labeled using the controlled vocabulary and severity rubric. Twenty-five base cases are expressed across four controlled wording/context variants. This supports consistency checks but is not a substitute for independent real-world feedback.

Labels cover eight categories, six intents, three sentiments, and four severities. Cases include performance/UX and bug/performance boundaries, feature requests, multi-signal text, neutral ambiguity, mixed-valence wording, and severity boundaries.

## Automatic Metrics

Category uses accuracy, per-class precision/recall/F1, macro F1, and confusion matrix. Intent uses accuracy. Sentiment uses accuracy and macro F1. Severity uses exact accuracy, mean ordinal distance, exact count, off-by-one count, and off-by-two-or-more count. Schema failure rate is computed over all samples.

## Human Review

Pain Point and User Need use 0/1/2 scores: correct, partially correct/surface-level, or incorrect/hallucinated. Hallucination means unsupported facts, product context, behavior, features, or user problems. Unreviewed rows remain blank and are excluded, never treated as zero.

## Confidence

Self-assessed confidence is bucketed into 0.9–1.0, 0.8–0.89, 0.7–0.79, and below 0.7, then compared with actual category accuracy. It is not a calibrated probability.

## Prompt Comparison

V1, V2, and V3 must use the same dataset, provider, model, temperature, schema, and metric code. Best prompt selection requires completed automatic and human review results; later version numbers receive no preference.

## Limitations

Synthetic variants share semantic structure, one annotator created labels, open-text review is pending, and no live provider was configured for this run.
