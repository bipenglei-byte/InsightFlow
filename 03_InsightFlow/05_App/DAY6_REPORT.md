# InsightFlow Day 6 Report

## Dataset and Runner
Created a 100-sample labeled dataset and 20-sample regression set. The reusable TypeScript runner supports prompt, dataset, output, and limit arguments; reuses production Provider/Schema; and writes predictions, metrics, confusion matrices, and error cases.

## V1 → V3
- V1: Category 66%, Intent 13%, Sentiment 82%, Severity 73%.
- V2: Category 66%, Intent 84%, Sentiment 93%, Severity 73%.
- V3: Category 70%, Intent 85%, Sentiment 95%, Severity 75%.
- Schema Failure Rate: 0% for all three 100-sample runs.

V3 is selected and wired into the production Feedback Pipeline. Category Macro F1 is 61.45% and Severity Mean Distance is 0.25.

## Confidence and Error Analysis
V3 high-confidence predictions are not calibrated: the 0.9–1.0 bucket achieved 78.16% Category Accuracy, while the 0.8–0.89 bucket achieved 14.29% on only 7 samples. Remaining errors concentrate in pricing/customer-service boundaries, bug vs performance/UX, suggestion vs request, and one-level severity underestimation.

## AI-assisted Proxy Review
All 100 V3 rows received a separate `AI_PROXY` review: Pain Point 1.45/2 (72.5%), User Need 1.40/2 (70.0%), and 7 proxy-flagged hallucination samples (7.0%). These numbers are not represented as Human Evaluation. The original blank human-review sheet is preserved for independent review.

Opportunity and PRD human review remain pending.

## Resume-ready Metrics
Built and executed a reproducible 100-sample, three-prompt evaluation; V3 improved Category Accuracy from 66% to 70%, Intent Accuracy from 13% to 85%, Sentiment Accuracy from 82% to 95%, and Severity Accuracy from 73% to 75%, with 0% schema failures across all three runs. Open-text proxy-review results must be labeled AI-assisted rather than human-validated.

## Known Limitations
Synthetic controlled variants, single-annotator labels, one provider/model, and missing human review limit generalizability.
