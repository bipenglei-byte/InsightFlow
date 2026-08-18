# InsightFlow AI Evaluation

## 1. Goal and Scope
Evaluate deterministic labels, structured-output reliability, confidence behavior, and later human review of pain points, user needs, and hallucination.

## 2. Dataset and Method
All runs used the same 100-sample `evaluation-dataset-v1`, SiliconFlow `Qwen/Qwen3.5-4B`, temperature 0.1, JSON Schema output, and metric code. Thinking was disabled for reproducible classification latency.

## 3. Automatic Results

| Metric | V1 | V2 | V3 |
| --- | ---: | ---: | ---: |
| Category Accuracy | 66% | 66% | **70%** |
| Category Macro F1 | 60.59% | 55.69% | **61.45%** |
| Intent Accuracy | 13% | 84% | **85%** |
| Sentiment Accuracy | 82% | 93% | **95%** |
| Sentiment Macro F1 | 80.25% | 89.26% | **92.19%** |
| Severity Accuracy | 73% | 73% | **75%** |
| Mean Severity Distance | 0.27 | 0.28 | **0.25** |
| Schema Failure Rate | 0% | 0% | 0% |

## 4. Prompt Iteration
V1 frequently treated complaints as requests. V2 added intent decision rules, explicit feature-request boundaries, and compact examples, improving Intent by 71 percentage points but reducing Category Macro F1. V3 added an ordered classification process and evidence self-check; it retained the intent improvement and produced the best automatic results overall.

## 5. Best Prompt
`feedback-analyzer-v3` is selected for production because it leads all reported automatic metrics except schema validity, where all versions tie at 100%.

## 6. Confidence Analysis
For V3, 87 samples were in the 0.9–1.0 bucket with 78.16% Category Accuracy. The 0.8–0.89 bucket contained 7 samples with 14.29% accuracy; lower buckets were small. Confidence is therefore not calibrated and can be overconfident.

## 7. Error Analysis
Remaining V3 problems include pricing mapped to bug/content, bugs mapped to performance/UX, customer-service feedback mapped to other product areas, suggestions mapped to requests, questions mapped to complaints, and severity often underestimated by one level.

## 8. AI-assisted Proxy Review
An explicitly labeled `AI_PROXY` review was completed for all 100 V3 rows. Pain Point averaged 1.45/2 (72.5% normalized), User Need averaged 1.40/2 (70.0%), and 7/100 samples were flagged for unsupported additions (7.0%). These are model-assisted proxy scores, not Human Evaluation, and must not be presented as independently human-validated results.

The untouched `manual_review_v3.csv` remains available for later independent human scoring. Opportunity and PRD human review are still pending.

## 9. Regression Dataset and Limitations
The 20-sample regression set covers category, intent, sentiment, severity, and user-need boundaries. The primary dataset is synthetic, uses controlled variants, and has single-annotator ground truth; reported results should not be generalized to production traffic.

## 10. Additional Evaluation Dimensions

| Dimension | Status |
| --- | --- |
| Schema Validity | Automated; all V1–V3 outputs passed schema validation |
| Evidence ID Validity | Automated; unknown feedback IDs are rejected |
| Priority Consistency | Automated; formula, clamp, and P0–P3 boundaries are unit-tested |
| Failure Recovery | Automated; retry merge preserves successful feedback and avoids duplicates |
| Evidence Precision | Pending independent human review |
| Evidence Coverage | Pending independent human review |
| User Need Quality | AI_PROXY only; not Human Evaluation |
| Requirement Quality | Pending independent human review |

The stored V1–V3 results were recompiled successfully on 2026-08-18. No new model calls were made, so this verification confirms reproducibility of the stored metrics rather than a new evaluation run.
