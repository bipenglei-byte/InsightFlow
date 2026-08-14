# InsightFlow AI Processing Modules

## 1. Purpose

本文定义 InsightFlow MVP 的 AI 处理边界、模块契约、Evidence 传播、验证与失败恢复。文中“Agent”表示可独立评估的 **AI Processing Module**，不要求实现为拥有自主规划能力的多 Agent 系统。

设计目标：

- 将复杂任务拆成可验证、可重试的阶段；
- 先产生结构化事实，再生成洞察和文档；
- AI 负责语义判断，确定性程序负责校验、聚合和评分；
- 任一事实性结论都能回溯到原始 Feedback；
- 单条或单模块失败不破坏已经成功的结果。

## 2. Architecture Overview

```text
Uploaded Dataset
  ↓
Deterministic Ingestion
  - file validation
  - field mapping
  - ID generation
  - normalization metadata
  ↓
Module 1: Feedback Analyzer
  ↓ validated FeedbackAnalysis[]
Module 2: Pain Point Analyzer
  ↓ validated PainPoint[] + Evidence IDs
Module 3: Requirement Module
  ↓ validated Requirement[] + inherited Evidence IDs
Module 4: Priority Module
  ↓ semantic scores
Deterministic Priority Calculator
  ↓ score + AI recommendation
Module 5A: Opportunity Generator
  ↓ Opportunity[] + inherited Evidence IDs
Human Review Gate
  ↓ confirmed opportunity
Module 5B: PRD Generator
  ↓ editable PRD Draft
```

确定性编排层负责：状态机、批处理、Schema Validation、ID 引用检查、重试、持久化、评分公式和审计记录。模型不得自行修改原始数据、业务价值或人工决定。

## 3. Shared Processing Contract

每次模块调用必须记录：

| 字段 | 说明 |
| --- | --- |
| `run_id` | 单次处理运行 ID |
| `batch_id` | 分析批次 ID |
| `module` | 模块名称与版本 |
| `model` | 模型标识 |
| `prompt_version` | 提示词版本 |
| `input_object_ids` | 输入对象 ID |
| `output_object_ids` | 成功输出 ID |
| `status` | pending / running / completed / failed |
| `attempt_count` | 1–3；首次 + 最多两次重试 |
| `error_code` | 失败时的稳定错误码 |

共同规则：

1. 输出只接受 JSON，不以自由文本作为模块间契约；
2. 输出先做 JSON 解析、Schema Validation、枚举与数值范围检查；
3. 下游引用必须指向同一项目 / 批次内已存在对象；
4. 模型提供的 ID 只可从允许的输入 ID 集合中选择；
5. 失败重试携带验证错误，但不携带无关上下文；
6. 相同幂等键的成功处理不得创建重复对象；
7. 原始输出可用于审计，但 UI 只消费验证后的规范对象。

## 4. Module 1 — Feedback Analyzer

### Responsibility

对单条反馈进行多标签分类、情绪、意图、功能、严重度和简短事实摘要。它不负责跨反馈聚类，也不生成最终 Requirement。

### Input

```json
{
  "feedback_id": "FB_001",
  "original_text": "最近 APP 经常闪退，而且启动特别慢",
  "rating": 1,
  "date": "2026-08-01",
  "source": "app_store",
  "language": "zh-CN"
}
```

`rating`、`date`、`source` 可为空；`feedback_id` 与 `original_text` 必填。模型只分析提供的文本，不补充用户身份、设备或原因。

### Output

```json
{
  "feedback_id": "FB_001",
  "categories": ["performance"],
  "intent": "complaint",
  "sentiment": "negative",
  "sentiment_score": -0.88,
  "features": ["app_stability", "startup"],
  "severity": "critical",
  "summary": "用户反馈应用频繁闪退且启动缓慢",
  "confidence": 0.91
}
```

### Rules

- Category 和 Feature 均允许多标签；
- Summary 只概括明示内容，不解释根因；
- Severity 判断影响强度，而非情绪强度；
- 信息不足时使用 `unknown` / 空数组并降低 Confidence；
- 不把产品建议直接转换为 Requirement。

### Validation & Failure

- `feedback_id` 必须等于输入 ID；
- `sentiment_score` ∈ [-1,1]，`confidence` ∈ [0,1]；
- 枚举非法、字段缺失或 JSON 解析失败时进入纠错重试；
- 两次重试后仍失败，记录 `AI_SCHEMA_INVALID` 或 `AI_REQUEST_FAILED`，继续其他反馈。

## 5. Module 2 — Pain Point Analyzer

### Responsibility

从验证后的 Feedback Analysis 中识别语义相近的问题，形成 Pain Point、子主题和代表性 Evidence。该模块不得创建没有 Feedback ID 支持的痛点。

### Input

- 一个 Analysis Batch 中的验证后 Feedback Analysis；
- 对应原文的受限引用视图；
- 可选的已有聚类标签，用于分块结果合并。

### Output

```json
{
  "pain_point_id": "PP_001",
  "name": "App Stability",
  "description": "用户频繁遇到崩溃、卡顿与启动缓慢",
  "feedback_count": 142,
  "percentage": 11.38,
  "severity": "critical",
  "confidence": 0.89,
  "subtopics": [
    {"name": "Crash", "feedback_count": 72},
    {"name": "Startup Speed", "feedback_count": 41},
    {"name": "Freeze", "feedback_count": 29}
  ],
  "supporting_feedback_ids": ["FB_001", "FB_014", "FB_052"]
}
```

### Deterministic Post-processing

- `feedback_count` 由去重后的 Evidence ID 数量计算，忽略模型声称的数量；
- `percentage = feedback_count / valid_feedback_count × 100`；
- 一条 Feedback 可支持多个 Pain Point，因此所有比例之和可以超过 100%；
- 代表性 Evidence 从完整支持集合中选择，但完整关系仍需持久化；
- 子主题数量由 ID 关系重新计算。

### Rules

- 区分问题对象和表面措辞，例如“增加年份按钮”先归入历史检索困难；
- 不因样本少自动丢弃 Critical 问题；
- 相似命名需合并，语义不同的问题不得因同一关键词强行合并；
- 描述中每个事实必须由 Supporting Feedback 支持。

### Validation & Failure

不存在或跨批次的 Evidence ID 会触发 `EVIDENCE_REFERENCE_INVALID`。Evidence 为空的输出直接拒绝，不进入 UI。分块聚类部分失败时，可用成功分块生成带 Warning 的结果，但必须降低 Confidence 并允许重试失败分块。

## 6. Module 3 — Requirement Module

### Responsibility

从已验证的 Pain Point 和 Evidence 推导 Underlying User Need 与候选 Requirement。它不选择具体最终方案，也不把单条 Feature Request 原样提升为产品需求。

### Input

```json
{
  "pain_point_id": "PP_001",
  "name": "App Stability",
  "description": "用户频繁遇到崩溃、卡顿与启动缓慢",
  "severity": "critical",
  "supporting_feedback_ids": ["FB_001", "FB_014", "FB_052"]
}
```

### Output

```json
{
  "requirement_id": "REQ_001",
  "pain_point_id": "PP_001",
  "user_need": "用户需要稳定且快速地访问应用核心功能",
  "requirement": "提升应用稳定性与启动性能",
  "requirement_type": "optimization",
  "rationale": "崩溃和启动缓慢阻断了核心访问路径",
  "supporting_feedback_ids": ["FB_001", "FB_014", "FB_052"],
  "confidence": 0.87
}
```

### Rules

- 推导顺序固定为 Evidence → Pain Point → User Need → Requirement；
- User Need 使用问题 / 目标语言，Requirement 使用能力语言；
- 具体 UI 或技术方案只能作为后续 Solution Direction；
- Evidence 必须是上游 Pain Point Evidence 的子集；
- 一个 Pain Point 可产生多个 Requirement，但需明确各自覆盖的 Evidence。

### Human Gate

PM 可编辑、合并、拒绝或确认 Requirement。只有已确认 Requirement 能进入正式 Priority Review 和 Opportunity 生成；AI 原值与人工值分开保存。

## 7. Module 4 — Priority Module

### Responsibility

AI 只评估语义维度并给出理由；确定性评分器负责 Frequency、加权总分和 P0–P3 映射。

### AI Input

- 已确认 Requirement；
- Pain Point Severity 与 Evidence；
- 同批次统计信息。

### AI Output

```json
{
  "requirement_id": "REQ_001",
  "severity_score": 95,
  "severity_reason": "崩溃会阻断用户进入核心功能",
  "impact_score": 90,
  "impact_reason": "问题影响启动和持续使用的核心路径",
  "confidence_level": "high",
  "confidence_score": 90,
  "supporting_feedback_ids": ["FB_001", "FB_014", "FB_052"]
}
```

### Deterministic Calculation

```text
Frequency = Requirement Evidence Count / Max Requirement Evidence Count × 100
Priority = Frequency × .30 + Severity × .25 + Impact × .20
         + Business Value × .15 + Confidence × .10
```

`business_value` 默认 50，只能由 PM 修改。总分四舍五入后映射：85–100 P0、65–84 P1、40–64 P2、0–39 P3。

### Rules

- Severity 和 Impact 必须有不同理由，避免重复计算同一概念；
- Confidence 表示结论证据强度，不表示需求价值；
- AI 不直接输出 P0–P3；
- Manual Priority Override 另存，不改写 AI Recommendation；
- 评分不自动包含战略契合度、开发成本、依赖或法规约束。

## 8. Module 5 — Opportunity & PRD

### 8.1 Opportunity Generator

**Input：** 已确认 Requirement、User Need、Pain Point、Priority 和 Evidence。

```json
{
  "opportunity_id": "OPP_001",
  "requirement_id": "REQ_001",
  "insight": "稳定性问题阻断用户进入和持续使用核心功能",
  "opportunity": "改善启动与运行可靠性，降低核心路径中断",
  "solution_directions": [
    "识别并修复高频崩溃路径",
    "优化冷启动关键资源加载",
    "建立稳定性监控与回归基线"
  ],
  "risks": [
    "仅优化启动速度可能无法解决运行时崩溃"
  ],
  "supporting_feedback_ids": ["FB_001", "FB_014", "FB_052"],
  "confidence": 0.86
}
```

Solution Directions 必须被标为建议，不能伪装为用户直接要求或已批准方案。PM 确认 Opportunity 后才能生成 PRD。

### 8.2 PRD Generator

**Input：** 只接受结构化 Source Context，不直接扫描整个原始文件：已确认 Opportunity、Requirement、Pain Point、Priority、成功指标模板与 Evidence 摘要/引用。

**Output Sections：** Background、Problem Statement、User Evidence、User Need、Product Goal、Success Metrics、User Stories、Functional Requirements、Edge Cases、Analytics、Acceptance Criteria。

规则：

- 事实性表述绑定 Evidence ID；
- 未被输入支持的数字不得生成；
- 方案、指标和边界案例属于草稿建议，应与事实区分；
- 生成内容不会覆盖 PM 已保存的编辑；
- PRD Draft 通过 Schema 后再渲染为 Markdown。

## 9. Evidence Lineage

```text
Feedback FB_*
  ↓ many-to-many
Pain Point PP_*
  ↓ inherits subset
Requirement REQ_*
  ↓ inherits subset
Opportunity OPP_*
  ↓ inherits subset
PRD Draft PRD_*
```

### Evidence Invariants

1. Pain Point 的 Supporting Feedback 必须存在且属于同一 Batch；
2. Requirement Evidence 必须是其 Pain Point Evidence 的子集；
3. Opportunity Evidence 必须是其 Requirement Evidence 的子集；
4. PRD 引用必须来自其 Opportunity Evidence；
5. Evidence 关系被人工修改后，下游对象标记为 `stale`，需重新验证或生成；
6. 任一可见 Insight 的 Supporting Feedback 不得为空。

## 10. Validation, Retry & Fallback

```text
Model Output
  ↓
JSON Parse
  ↓
Schema Validation
  ↓
Semantic / Reference Validation
  ├─ Valid → Persist
  └─ Invalid → Corrective Retry 1 → Corrective Retry 2
                                ├─ Valid → Persist
                                └─ Invalid → Processing Error
```

Fallback 的含义是保留可用上游结果和明确失败状态，不是用未经验证的文本绕过 Schema。失败对象不会参与聚合、评分或生成。

### Error Codes

| Code | 含义 | 是否可重试 |
| --- | --- | --- |
| `AI_REQUEST_FAILED` | 模型请求超时、限流或服务错误 | 是 |
| `AI_JSON_INVALID` | 无法解析 JSON | 是 |
| `AI_SCHEMA_INVALID` | 结构、枚举或范围不合法 | 是 |
| `EVIDENCE_REFERENCE_INVALID` | 引用了不存在或越界的对象 | 是 |
| `EVIDENCE_REQUIRED` | 洞察没有 Evidence | 是 / 需人工检查 |
| `LOW_CONFIDENCE` | 输出有效但需要人工审核 | 否，非硬失败 |
| `PROCESSING_DEPENDENCY_FAILED` | 必需上游对象失败 | 上游恢复后 |

## 11. Human Editing & Audit

每个可编辑对象保存：

- `ai_original`：模型验证后的原值；
- `human_revision`：PM 当前修改值；
- `review_status`：unreviewed / accepted / edited_and_accepted / rejected；
- `reviewed_at`、`updated_at`；
- Priority 额外保存 AI Recommendation 和 Manual Override。

人工编辑永远不用于伪装模型准确率。评估时可分别统计直接接受、编辑后接受和拒绝。

## 12. Evaluation Hooks

- 每个模块可以在固定数据集上独立运行和评分；
- 保存数据集版本、模型、提示词、Schema 和模块版本；
- Feedback Analyzer 评估多标签 Precision / Recall / F1；
- Pain Point Analyzer 评估聚类一致性、Evidence Precision 与低频严重问题 Recall；
- Requirement Module 评估 Need/Requirement 区分和 Evidence 一致性；
- Priority Module 评估语义评分一致性，不把公式误算归因给模型；
- PRD Generator 评估事实支持率、完整性和可编辑性。

## 13. MVP Decisions

- 不要求自主 Agent、工具调用规划、Agent 间自由对话或长期记忆；
- 不使用模型计算最终 Priority Score；
- 不让模型生成或修改内部 ID；
- 不向 UI 暴露未验证输出；
- 不因部分失败丢弃整批结果；
- 不允许无 Evidence 的 Insight 进入下游。

