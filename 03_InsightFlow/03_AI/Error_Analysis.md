# Error Analysis

## V1 Findings
- 48 complaints were predicted as requests.
- Feature requests were over-predicted for bug, UX, pricing, and other cases.
- Severity errors were exclusively one level apart, usually underestimation.

## Prompt Changes
V2 added intent definitions, explicit feature-request boundaries, and six compact examples. V3 added a stable decision order and evidence self-check.

## V3 Remaining Errors
- Pricing → bug: 4 cases; pricing → content: 3.
- Bug → performance: 4; bug → UX: 3.
- Customer service → UX/content/pricing: 7 combined.
- Suggestion → request: 7; question → complaint: 4; praise → complaint: 3.
- High → medium: 11; medium → low: 7; medium → high: 5.

These patterns suggest semantic-area ambiguity remains stronger than output-format instability. Next changes should add targeted pricing/customer-service boundaries and refine suggestion/request and impact-based severity rules, then run the regression set before the full dataset.
