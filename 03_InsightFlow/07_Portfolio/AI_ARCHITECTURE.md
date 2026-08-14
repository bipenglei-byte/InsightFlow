# InsightFlow AI Architecture

```mermaid
flowchart TD
  A["User Feedback"] --> B["Feedback Analyzer"]
  B --> C["Structured Output"]
  C --> D{"Schema Validation"}
  D -->|Valid| E["Pain Point Consolidation"]
  D -->|Invalid| R["Retry up to 2 times"]
  R --> D
  D -->|Still invalid| F["Visible Processing Failure"]
  E --> G["Evidence Mapping"]
  G --> H["Requirement Extraction"]
  H --> I["Deterministic Priority Algorithm"]
  I --> J["Opportunity / PRD"]
  G --> K["Original Feedback Review"]
  I --> L["PM Business Value and Override"]
```

Semantic reasoning and deterministic calculation are separated. Every displayed insight retains evidence IDs, while business judgement and final priority remain editable by the PM.

