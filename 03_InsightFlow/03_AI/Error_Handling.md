# AI Error Handling

| State | Behavior |
| --- | --- |
| Schema failure | Feed validation feedback to the model, retry twice, then fail only that item. |
| Provider failure | Show a safe retryable message without secrets. |
| Timeout | Abort at the configured timeout and offer retry. |
| Rate limit | Return HTTP 429 with retry-later guidance. |
| Partial failure | Preserve successful items and report counts. |
| Low confidence | Show review guidance; confidence is not calibrated probability. |
| Insufficient evidence | Block normal publication and requirement creation. |
| Demo fallback | Missing provider configuration selects transparent Demo Mode. |
