# InsightFlow AI Output Schema

## 1. Purpose and Conventions

本文是 Day 2 的产品级数据契约，供后续 API、数据库和运行时 Schema 实现使用。示例采用 JSON，但本文不是可执行 JSON Schema 文件。

约定：

- 所有 ID 为系统生成的不可变字符串，模型只能引用输入提供的 ID；
- 时间使用 ISO 8601 UTC；日期使用 `YYYY-MM-DD`；
- 概率 / Confidence 使用 0–1；Priority 输入分数使用 0–100；
- 缺失信息使用 `null` 或空数组，不使用空字符串伪装未知；
- 原始 Feedback 与 AI 输出分离保存；
- 所有对象必须包含 `schema_version`；MVP 为 `1.0`；
- `additionalProperties` 在实现时默认设为 `false`，防止模型漂移字段。

## 2. Enumerations

```text
Sentiment: positive | neutral | negative | mixed | unknown
Intent: complaint | request | praise | question | report | other | unknown
Severity: critical | high | medium | low | unknown
RequirementType: new_capability | optimization | bug_fix | usability | reliability | other
ConfidenceLevel: high | medium | low
Priority: P0 | P1 | P2 | P3
ReviewStatus: unreviewed | accepted | edited_and_accepted | rejected
ProcessingStatus: pending | running | completed | completed_with_errors | failed
```

Category 和 Feature 初期使用规范化 `snake_case` 字符串并保留 `other`，具体 taxonomy 在评估阶段形成版本化字典，避免过早锁死行业分类。

## 3. Raw Feedback

该对象由导入层创建，不是模型输出。

```json
{
  "schema_version": "1.0",
  "feedback_id": "FB_001",
  "batch_id": "BAT_001",
  "original_text": "最近 APP 经常闪退，而且启动特别慢",
  "source_record_id": "review-123",
  "rating": 1,
  "date": "2026-08-01",
  "source": "app_store",
  "language": "zh-CN",
  "is_exact_duplicate": false,
  "created_at": "2026-08-14T02:00:00Z"
}
```

### Constraints

- `feedback_id`、`batch_id`、`original_text`、`schema_version` 必填；
- `original_text` 去除首尾空格后长度必须 >0，原始值仍需安全保留；
- `rating` 可空；允许范围取决于导入映射，不默认假设 1–5；
- `source_record_id` 可空且不作为内部主键；
- 原文不可被任何 AI 模块覆盖。

## 4. Feedback Analysis

```json
{
  "schema_version": "1.0",
  "analysis_id": "FBA_001",
  "feedback_id": "FB_001",
  "categories": ["performance"],
  "intent": "complaint",
  "sentiment": "negative",
  "sentiment_score": -0.88,
  "features": ["app_stability", "startup"],
  "severity": "critical",
  "summary": "用户反馈应用频繁闪退且启动缓慢",
  "confidence": 0.91,
  "model_metadata": {
    "module": "feedback_analyzer",
    "module_version": "1.0",
    "prompt_version": "1.0",
    "model": "provider/model-version",
    "run_id": "RUN_001"
  }
}
```

### Required

`schema_version`、`analysis_id`、`feedback_id`、`categories`、`intent`、`sentiment`、`sentiment_score`、`features`、`severity`、`summary`、`confidence`、`model_metadata`。

### Constraints

- `categories`、`features` 去重；允许空数组；
- `sentiment_score` ∈ [-1,1]；`confidence` ∈ [0,1]；
- `summary` 不能为空且只包含原文可支持内容；
- `feedback_id` 必须引用同一 Batch 的 Raw Feedback。

## 5. Subtopic

```json
{
  "name": "Crash",
  "feedback_count": 72,
  "supporting_feedback_ids": ["FB_001", "FB_014"]
}
```

`feedback_count` 由系统根据唯一 ID 数量计算，不信任模型计数。

## 6. Pain Point

```json
{
  "schema_version": "1.0",
  "pain_point_id": "PP_001",
  "batch_id": "BAT_001",
  "name": "App Stability",
  "description": "用户频繁遇到崩溃、卡顿与启动缓慢",
  "feedback_count": 142,
  "percentage": 11.38,
  "severity": "critical",
  "confidence": 0.89,
  "subtopics": [
    {
      "name": "Crash",
      "feedback_count": 72,
      "supporting_feedback_ids": ["FB_001", "FB_014"]
    }
  ],
  "supporting_feedback_ids": ["FB_001", "FB_014", "FB_052"],
  "representative_feedback_ids": ["FB_001", "FB_052"],
  "review_status": "unreviewed",
  "is_stale": false
}
```

### Constraints

- Evidence 至少 1 条，ID 唯一且属于同一 Batch；
- Representative IDs 必须是 Supporting IDs 的子集；
- `feedback_count` 等于 Supporting IDs 的唯一数量；
- `percentage` ∈ [0,100]，由系统根据有效反馈总数计算；
- `confidence` ∈ [0,1]；
- 一条 Feedback 可支持多个 Pain Point。

## 7. Requirement

```json
{
  "schema_version": "1.0",
  "requirement_id": "REQ_001",
  "pain_point_id": "PP_001",
  "user_need": "用户需要稳定且快速地访问应用核心功能",
  "requirement": "提升应用稳定性与启动性能",
  "requirement_type": "optimization",
  "rationale": "崩溃和启动缓慢阻断了核心访问路径",
  "supporting_feedback_ids": ["FB_001", "FB_014", "FB_052"],
  "confidence": 0.87,
  "review_status": "unreviewed",
  "is_stale": false
}
```

### Constraints

- `pain_point_id` 必须存在；
- Supporting IDs 非空且必须是上游 Pain Point Evidence 的子集；
- `user_need` 描述目标 / 问题，不直接指定 UI 或技术方案；
- `confidence` ∈ [0,1]；
- 进入 Priority 或 Opportunity 前，`review_status` 必须为 `accepted` 或 `edited_and_accepted`。

## 8. Priority Assessment

```json
{
  "schema_version": "1.0",
  "priority_assessment_id": "PRI_001",
  "requirement_id": "REQ_001",
  "frequency_score": 100,
  "severity_score": 95,
  "severity_reason": "崩溃会阻断用户进入核心功能",
  "impact_score": 90,
  "impact_reason": "问题影响启动和持续使用的核心路径",
  "business_value": 50,
  "confidence_level": "high",
  "confidence_score": 90,
  "priority_score": 88,
  "ai_recommendation": "P0",
  "manual_priority": null,
  "manual_override_reason": null,
  "supporting_feedback_ids": ["FB_001", "FB_014", "FB_052"],
  "calculation_version": "1.0",
  "updated_at": "2026-08-14T02:00:00Z"
}
```

### Ownership

| 字段 | 产生者 |
| --- | --- |
| Frequency Score | 确定性统计 |
| Severity / Impact + Reason | AI，Schema 验证后使用 |
| Business Value | 系统默认 50，PM 可修改 |
| Confidence Level / Score | AI 提供依据，系统映射与验证 |
| Priority Score | 确定性公式 |
| AI Recommendation | 确定性区间映射 |
| Manual Priority / Reason | PM |

### Constraints

- 五项分数与 Priority Score ∈ [0,100]；
- `priority_score` 必须可由输入与 `calculation_version` 重算得到；
- `ai_recommendation` 必须匹配分数区间；
- Manual Priority 可空；存在时不覆盖 AI Recommendation；
- Business Value 修改触发重新计算并更新审计时间。

## 9. Opportunity

```json
{
  "schema_version": "1.0",
  "opportunity_id": "OPP_001",
  "requirement_id": "REQ_001",
  "insight": "稳定性问题阻断用户进入和持续使用核心功能",
  "opportunity": "改善启动与运行可靠性，降低核心路径中断",
  "solution_directions": [
    "识别并修复高频崩溃路径",
    "优化冷启动关键资源加载"
  ],
  "risks": ["仅优化启动速度可能无法解决运行时崩溃"],
  "supporting_feedback_ids": ["FB_001", "FB_014", "FB_052"],
  "confidence": 0.86,
  "review_status": "unreviewed",
  "is_stale": false
}
```

### Constraints

- `requirement_id` 必须存在且已确认；
- Supporting IDs 非空且为 Requirement Evidence 的子集；
- Solution Directions 是建议，不代表用户原话或批准方案；
- 生成 PRD 前 Opportunity 必须已确认且 `is_stale=false`。

## 10. PRD Draft

```json
{
  "schema_version": "1.0",
  "prd_draft_id": "PRD_001",
  "opportunity_id": "OPP_001",
  "title": "应用稳定性与启动性能优化",
  "sections": {
    "background": "...",
    "problem_statement": "...",
    "user_evidence": [
      {"feedback_id": "FB_001", "excerpt": "最近 APP 经常闪退"}
    ],
    "user_need": "...",
    "product_goal": "...",
    "success_metrics": ["..."],
    "user_stories": ["..."],
    "functional_requirements": ["..."],
    "edge_cases": ["..."],
    "analytics": ["..."],
    "acceptance_criteria": ["..."]
  },
  "source_feedback_ids": ["FB_001", "FB_014", "FB_052"],
  "generation_status": "generated",
  "has_human_edits": false,
  "is_stale": false,
  "created_at": "2026-08-14T02:00:00Z",
  "updated_at": "2026-08-14T02:00:00Z"
}
```

### Constraints

- 所有 Section Key 必须存在；列表允许为空，但 UI 应提示待完善；
- User Evidence 中的 ID 必须属于 `source_feedback_ids`；
- Source IDs 必须是 Opportunity Evidence 的子集；
- 事实性数字必须来自 Source Context；
- 人工编辑后设置 `has_human_edits=true`；
- 上游变化后设置 `is_stale=true`，不得静默覆盖已有草稿。

## 11. Review Overlay

为避免 AI 原值被覆盖，可编辑对象使用审阅覆盖层：

```json
{
  "object_id": "REQ_001",
  "object_type": "requirement",
  "review_status": "edited_and_accepted",
  "human_revision": {
    "requirement": "降低应用崩溃率并改善冷启动体验"
  },
  "reviewed_by": "USER_001",
  "reviewed_at": "2026-08-14T03:00:00Z"
}
```

MVP Demo 即使没有真实认证，也可使用本地固定用户 ID。`human_revision` 只允许覆盖该对象定义为可编辑的字段。

## 12. Processing Error

```json
{
  "schema_version": "1.0",
  "error_id": "ERR_001",
  "batch_id": "BAT_001",
  "module": "feedback_analyzer",
  "input_object_id": "FB_009",
  "code": "AI_SCHEMA_INVALID",
  "message": "severity is not an allowed value",
  "attempt_count": 3,
  "retryable": true,
  "status": "failed",
  "created_at": "2026-08-14T02:10:00Z"
}
```

用户界面显示友好说明，内部 `message` 不应直接泄露供应商响应或敏感数据。

## 13. Analysis Batch Summary

```json
{
  "schema_version": "1.0",
  "batch_id": "BAT_001",
  "project_id": "PROJ_001",
  "status": "completed_with_errors",
  "source_row_count": 1248,
  "valid_feedback_count": 1248,
  "processed_count": 1239,
  "failed_count": 9,
  "low_confidence_count": 17,
  "skipped_count": 0,
  "visible_insight_count": 26,
  "traceable_insight_count": 26
}
```

### Count Invariants

- `processed_count + failed_count + skipped_count = valid_feedback_count`；
- `traceable_insight_count = visible_insight_count`，否则批次验证不通过；
- 状态为 `completed_with_errors` 时至少有一项成功和一项失败；
- `failed` 表示没有可发布的分析结果，不等于单项失败。

## 14. Reference Integrity

```text
Project 1 ── * Analysis Batch
Batch   1 ── * Raw Feedback
Feedback 1 ── 0..1 Feedback Analysis
Feedback * ── * Pain Point
Pain Point 1 ── * Requirement
Requirement 1 ── 0..1 Priority Assessment
Requirement 1 ── * Opportunity
Opportunity 1 ── * PRD Draft Version
```

下游 Evidence 必须逐层收窄或保持，不能引入上游未提供的 Feedback ID。上游 Evidence 变化时，相关下游对象标记 Stale。

## 15. Validation Order

1. JSON 语法；
2. 必填字段与类型；
3. 枚举、长度和数值范围；
4. ID 格式；
5. 引用对象存在且属于同一 Project / Batch；
6. Evidence 子集约束；
7. 确定性计数和公式重算；
8. 发布规则：Evidence 非空、状态有效、上游已确认。

任一步失败均不允许对象进入下游。自动纠错最多两次；仍失败则创建 Processing Error。

## 16. Implementation Notes for Later Development

- 后续应将本文拆分为机器可执行 JSON Schema；
- 枚举与 Schema 均需版本化，历史对象保留其版本；
- 数据库可按性能需求规范化，但不得丢失 Evidence 多对多关系；
- Markdown 是 PRD Draft 的导出格式，不是内部唯一数据源；
- 不在日志中记录完整用户原文或第三方模型密钥；
- 示例数值仅用于说明，不是评估结果。

## Day 2 Schema Checklist

- [x] Feedback Analysis
- [x] Pain Point
- [x] Requirement
- [x] Priority Assessment
- [x] Opportunity
- [x] PRD Draft
- [x] Evidence 引用与子集规则
- [x] Review Overlay
- [x] Processing Error 与 Batch Summary
- [x] 校验、重试与发布顺序
