# InsightFlow Final Figma Specification

> 本文档描述最终 Figma 文件中已经存在的页面、状态和 Prototype 连接，不包含未落地规划。

## 1. File Structure

由于当前 Figma 方案限制，最终文件使用 3 个物理 Pages，并在第三页内用 Section 区分产品页面和 Prototype。

```text
00–01 — Cover & Foundations
├── 00 — Cover
└── 01 — Foundations

02 — Components
└── 02 — Components

03–04 — Product Screens & Prototype
├── 03 — Product Screens
└── 04 — Prototype
```

## 2. Final Product Screens

`03 — Product Screens` 中包含 12 个 1440 × 1080 页面：

| # | Frame name | Main purpose |
| ---: | --- | --- |
| 1 | `Dashboard — 1440px` | KPI、痛点、情绪、优先需求和近期 AI Insights 总览 |
| 2 | `Projects` | 查看项目并创建新项目 |
| 3 | `Create Project` | 填写项目、产品、目标和数据源信息 |
| 4 | `Upload Dataset` | 上传 CSV/XLSX 数据集 |
| 5 | `Field Mapping` | 映射 Feedback Content、Rating、Date、Source |
| 6 | `AI Processing` | 展示分阶段分析进度和已处理数量 |
| 7 | `Analysis Overview` | 汇总反馈数量、洞察、情绪和主要痛点 |
| 8 | `Feedback Analysis` | 展示原始反馈及结构化 AI 字段 |
| 9 | `Pain Point Detail` | 展示痛点摘要、拆分、User Need、Opportunity 与 Evidence 入口 |
| 10 | `Requirements` | 展示需求、反馈量、Severity、Impact、Score 和 Priority |
| 11 | `Requirement Detail` | 展示五项评分、AI Recommendation、Business Value 与人工决策 |
| 12 | `PRD Generator` | 同屏展示 Source Context 和可编辑 PRD Draft |

## 3. Components

组件页实际包含：

- App shell：Sidebar、Sidebar Item、Topbar、Breadcrumb、Tabs
- Actions/forms：Button、Input、Select、Textarea、File Upload
- Badges：Badge、Priority Badge、Sentiment Badge、Severity Badge、Confidence Badge
- Data display：Metric Card、Insight Card、Feedback Row、Requirement Row、Table
- Feedback/status：Alert、Toast、Empty State、Error State、Skeleton、Progress

详细 variant 和 token 记录见 `Design_System.md`。

## 4. Design Tokens

最终文件包含：

- `Primitives / Color`：14 个颜色变量
- `Semantic / Light`：24 个语义颜色变量
- `Dimensions`：18 个 spacing、radius、border 和 control-size 变量
- 10 个 Inter Text Styles
- 2 个 Elevation Effect Styles

当前只存在 Light mode；文档不将 Dark mode 记录为已完成能力。

## 5. AI States

`04 — Prototype` 中实际包含以下 AI 相关状态：

| Frame | Meaning | User control |
| --- | --- | --- |
| `State / AI Processing` | 正在执行结构化分析 pipeline | 查看真实阶段和处理数量 |
| `State / Partial Processing Failure` | 1,239 条成功、9 条失败 | 查看可用结果或重试失败项 |
| `State / Retry Failed Items` | 单独列出失败反馈与原因 | 只重试失败项 |
| `State / Low Confidence` | 小样本或聚类一致性不足 | Review Evidence、Edit Suggestion、Reject |
| `State / Insufficient Evidence` | 洞察没有有效 supporting feedback | 阻断发布和 Create Requirement |

这些状态共同落实 Evidence First、AI Suggests PM Decides、Human Editable 和 Failure Is Visible。

## 6. Empty, Loading and Error States

最终文件包含以下状态 Frame：

| Type | Frame | Key behavior |
| --- | --- | --- |
| Empty | `State / Empty Dashboard` | 引导开始 New Analysis |
| Empty | `State / Empty Project` | 引导创建首个项目 |
| Upload error | `State / Upload Error` | 显示上传中断并提供 Retry/Replace |
| Invalid input | `State / Invalid File` | 明确仅支持 CSV/XLSX 与文件限制 |
| Mapping error | `State / Missing Feedback Column` | 标记 Feedback Content 必填并禁用 Start Analysis |
| Loading | `State / Loading Skeleton` | 使用稳定布局 Skeleton |
| Success | `State / Success Toast` | Requirement 创建成功，提示继续 PM Review |

## 7. Supporting Evidence

最终文件包含独立页面 `Prototype / Supporting Evidence`，而不是右侧 Drawer。页面实际展示：

- Pain Point：Search Experience
- Supporting feedback 数量：186
- Severity：High
- 三条代表性原始反馈
- Feedback ID、来源和评分/情绪元数据
- `Back to Pain Point`
- `Create Requirement`

该页面是当前 Prototype 中 Evidence First 的主要落地方式。

## 8. Final Prototype Flow

### Primary flow

```text
Dashboard — 1440px
  → New Analysis
Create Project
  → Create Project
Upload Dataset
  → Browse / Continue
Field Mapping
  → Start Analysis
AI Processing
  → View Analysis
Analysis Overview
  → Open Search Experience
Pain Point Detail
  → View all 186 evidence
Prototype / Supporting Evidence
  → Create Requirement
Requirement Detail
  → Generate PRD
PRD Generator
```

### Additional connected paths

```text
Projects → New Project → Create Project
Pain Point Detail → Create Requirement → Requirement Detail
Requirements → Requirement Row → Requirement Detail
Supporting Evidence → Back to Pain Point → Pain Point Detail
Requirement Detail → Save Decision → PRD Generator
```

Prototype page navigation uses a short Dissolve transition. `Export Markdown` 存在 URL action，但当前 Figma Prototype 不模拟真实文件导出。

## 9. Key Product Design Decisions

### Evidence First

- Pain Point Detail 提供明确 Evidence CTA。
- Evidence 页面保留原始 feedback ID 和文本。
- Insufficient Evidence 状态阻断洞察继续转化为 Requirement。

### AI Suggests, PM Decides

- Low Confidence 不自动接受 AI 洞察。
- Requirement Detail 将 AI Recommendation 和人工决策分开。
- Business Value 由 PM 调整，Manual Override 不覆盖 AI 原始建议。

### Structured Before Generated

- 主流程先经过 Field Mapping 和 AI Processing。
- Analysis、Pain Point、Evidence、Requirement 完成后才进入 PRD Generator。

### Failure Is Visible

- 上传、文件格式、字段映射和 AI 局部失败均有独立状态。
- 局部失败保留已成功结果，不使用笼统的全局 `Analysis Failed`。

## 10. Final QA Record

- 12 个产品页面和 12 个请求状态均存在。
- Supporting Evidence 页面存在并已连接。
- 主流程关键 CTA 均有明确目标。
- 组件页未发现同名重复主组件。
- 状态画板未检测到文字越界。
- Low Confidence 和 Insufficient Evidence 均保留人工审核或阻断机制。
- Requirement Detail 未将 AI Recommendation 作为自动最终决策。

## 11. Explicitly Not Implemented in the Final File

以下内容不作为最终 Figma 已完成资产记录：

- 独立 Evidence Drawer 组件
- Confirm Modal
- Stale PRD 状态
- Human Edited 独立状态页面
- Dark theme
- 真实导出流程
- Jira、飞书、团队协作或自动抓取评论
