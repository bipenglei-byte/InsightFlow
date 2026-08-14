# InsightFlow Design System

> 本文档依据最终 Figma 文件更新，仅记录已经建立的设计资产。

## 1. Design Direction

InsightFlow 采用专业、克制、数据密集的 AI B2B SaaS 视觉语言。界面以浅色数据工作台为主体，深色侧栏提供稳定导航，蓝色用于主要操作与信息链接，语义色仅用于明确状态。

设计遵循以下产品原则：

- **Evidence First**：洞察能够进入 Supporting Evidence，无法通过 Evidence Gate 的洞察不得继续使用。
- **AI Suggests, PM Decides**：AI Recommendation 与 PM Decision 分开呈现。
- **Structured Before Generated**：先完成反馈结构化与聚类，再生成 Requirement 和 PRD Draft。
- **Human Editable**：需求评分、Business Value 和最终优先级保留人工控制。
- **Failure Is Visible**：上传错误、部分失败、低置信度和无证据状态均明确展示。

视觉上不使用大面积渐变、Glassmorphism、发光 AI Orb、聊天机器人布局或纯装饰性 AI 元素。

## 2. Layout

| Item | Final value |
| --- | ---: |
| Desktop frame | 1440 × 1080 px |
| Sidebar | 240 px |
| Topbar | 64 px |
| Main area | 1200 px |
| Main content padding | 32 px |

主要页面采用 Desktop-first App Shell。卡片和表格依靠浅色背景、1 px 边框与间距建立层级，不依赖强阴影。

## 3. Design Tokens

### 3.1 Variable collections

最终文件包含 3 个变量集合：

| Collection | Mode | Variables |
| --- | --- | ---: |
| `Primitives / Color` | `Mode 1` | 14 |
| `Semantic / Light` | `Light` | 24 |
| `Dimensions` | `Mode 1` | 18 |

### 3.2 Primitive colors

| Token | Value |
| --- | --- |
| `neutral/0` | `#FFFFFF` |
| `neutral/25` | `#FAFBFC` |
| `neutral/50` | `#F5F7F9` |
| `neutral/100` | `#E9EDF2` |
| `neutral/200` | `#D5DBE3` |
| `neutral/400` | `#8A96A6` |
| `neutral/600` | `#526071` |
| `neutral/800` | `#263445` |
| `neutral/950` | `#111B29` |
| `brand/50` | `#EEF6FF` |
| `brand/100` | `#DCEBFF` |
| `brand/500` | `#2878D4` |
| `brand/600` | `#1765BE` |
| `brand/700` | `#13539B` |

### 3.3 Semantic colors

背景、文字、边框和主要操作通过 Semantic Variables 引用 Primitive Variables。状态色如下：

| Status | Surface | Content |
| --- | --- | --- |
| Success | `#ECF8F1` | `#177245` |
| Warning | `#FFF7E6` | `#8A5A00` |
| Danger | `#FFF0F0` | `#B4232D` |
| Info | `#EEF6FF` | `#1765BE` |
| Human | `#F3EFFE` | `#6741B9` |

`Human` 用于 PM Decision、Human edited 或 Manual Override 等人工来源信息。状态不能只依赖颜色，还需同时显示文字。

### 3.4 Dimensions

| Group | Tokens |
| --- | --- |
| Spacing | `0, 4, 8, 12, 16, 20, 24, 32, 40, 48 px` |
| Radius | `4, 6, 8, 10 px` |
| Border | `1 px` |
| Control height | `32, 36, 40 px` |

### 3.5 Typography

最终文件使用 Inter，并建立以下 Text Styles：

| Style | Size / line height | Weight |
| --- | --- | --- |
| `Type/Display` | 28 / 36 | Semi Bold |
| `Type/H1` | 24 / 32 | Semi Bold |
| `Type/H2` | 20 / 28 | Semi Bold |
| `Type/H3` | 16 / 24 | Semi Bold |
| `Type/Body` | 14 / 22 | Regular |
| `Type/Body Strong` | 14 / 22 | Semi Bold |
| `Type/Small` | 12 / 18 | Regular |
| `Type/Label` | 12 / 16 | Semi Bold |
| `Type/Metric` | 28 / 32 | Semi Bold |
| `Type/Table` | 13 / 20 | Regular |

### 3.6 Elevation

| Style | Value |
| --- | --- |
| `Elevation/1` | `0 1px 2px rgba(17,27,41,.06)` |
| `Elevation/2` | `0 8px 24px rgba(17,27,41,.10)` |

## 4. Final Component Inventory

以下是 `02 — Components` 页面中实际存在的可复用主组件；variant 子组件不重复计入主清单。

### Navigation and structure

- `Sidebar`
- `Sidebar Item`：`Default`, `Active`
- `Topbar`
- `Breadcrumb`
- `Tabs`

### Actions and forms

- `Button`：`Primary`, `Secondary`, `Tertiary`, `Danger`
- `Input`
- `Select`
- `Textarea`
- `File Upload`

### Status and provenance

- `Badge`：`AI suggested`, `Human edited`, `Accepted`, `Failed`
- `Priority Badge`：`P0`, `P1`, `P2`, `P3`
- `Sentiment Badge`：`Positive`, `Neutral`, `Negative`, `Mixed`
- `Severity Badge`：`Critical`, `High`, `Medium`, `Low`
- `Confidence Badge`：`High`, `Medium`, `Low`
- `Alert`：`Info`, `Warning`, `Danger`, `Success`
- `Toast`
- `Progress`

### Data presentation

- `Metric Card`
- `Insight Card`
- `Feedback Row`
- `Requirement Row`
- `Table`

### System states

- `Empty State`
- `Error State`
- `Skeleton`

## 5. Component Usage Decisions

- Primary Button 只用于当前阶段最重要的下一步。
- Confidence、Severity、Priority 和 Sentiment 使用各自独立 Badge，不混用语义。
- AI 输出通过 `AI suggested` 标识来源；人工修改使用 `Human edited`，不覆盖原始 AI 来源。
- `Alert` 用于需要用户理解或处理的页面内状态；`Toast` 用于短暂成功反馈。
- AI Processing 使用阶段列表和处理数量，不使用单一 spinner。
- 数据页优先使用 Metric Card、Insight Card、Table 和对应 Row 组件保持可扫描性。

## 6. Accessibility and Readability

- 正文以 14 px 为主，12 px 仅用于标签和辅助信息。
- 主文字、次级文字、边框和背景使用语义 tokens，保持稳定对比度。
- 状态同时使用颜色与文字标签。
- 长文本集中在反馈、Evidence 和 PRD 内容区，核心数值保持清晰对齐。
- 关键操作使用明确动词，如 `Retry Failed Items`、`Review Evidence`、`Generate PRD`。

## 7. Key Product Design Decisions

1. **AI 洞察必须可追溯**：Pain Point Detail 可进入独立 Supporting Evidence 页面。
2. **无证据即阻断**：Insufficient Evidence 明确显示 0 supporting evidence，并禁用 Create Requirement。
3. **部分失败不阻断全部结果**：成功分析的数据仍可查看，失败项单独重试。
4. **置信度影响审核方式，不替代决策**：Low Confidence 提供 Review Evidence、Edit Suggestion 和 Reject。
5. **优先级保留 PM 控制**：Requirement Detail 同时展示 AI Recommendation、Business Value、PM Decision 和 Manual Override。
6. **生成内容保留来源上下文**：PRD Generator 同屏展示 Source Context 和 PRD Draft。
7. **结构化处理可见**：AI Processing 明确展示 Data Cleaning、Classification、Sentiment、Pain Point、Requirement 和 Opportunity 等阶段。
