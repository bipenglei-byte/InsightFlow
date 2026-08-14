# InsightFlow PRD

## 1. Document Information

| 属性 | 内容 |
| --- | --- |
| 产品 | InsightFlow — AI User Research & Product Insights Agent |
| 版本 | MVP / Day 2 |
| 状态 | Product Definition Complete |
| 核心用户 | 1–5 年经验的互联网产品经理 / AI 产品经理 |
| 关联文档 | `Product_Brief.md`、`User_Flow.md`、`Agent_Design.md`、`AI_Output_Schema.md` |

本文定义产品行为与验收边界，不代表技术实现方案。文中的文件大小、数据行数、耗时和质量阈值均为 MVP 设计目标，需在开发与评估阶段验证。

## 2. Product Overview

InsightFlow 将 CSV/XLSX 中的非结构化用户反馈转换为可追溯的结构化分析结果：

> Structured Feedback → Pain Point → User Need → Requirement → Priority → Product Opportunity → PRD Draft

MVP 只服务一条闭环：

> Upload → Analyze → Understand → Prioritize → Act

InsightFlow 是 **AI Decision Support**，不是 AI Decision Maker。AI 负责语义理解和建议，确定性算法负责计算，产品经理负责审核、修改和最终决策。

## 3. Product Goal

### 用户目标

- 在 10–30 分钟内理解一批反馈中最重要的 5–10 个问题；
- 从任一洞察下钻至原始用户反馈，判断结论是否可信；
- 用透明的评分维度比较候选需求；
- 将已确认的产品机会转为可编辑、可导出的 PRD 草稿。

### MVP 验证目标

- 验证 PM 是否愿意用 AI 批量分析替代逐条整理；
- 验证“结构化结果 + Evidence + 人工审核”是否足以建立信任；
- 验证洞察能否继续转化为优先级判断和需求草稿。

### 非目标

- 自动决定 Roadmap 或自动发布 PRD；
- 替代正式用户访谈、可用性测试或业务战略判断；
- 企业级实时数据管道、协作审批、权限系统和外部集成。

## 4. User Persona

**张景，28 岁，SaaS 产品经理，3 年经验。** 每周从 App Store、客服、企业微信群和问卷收到约 200–500 条反馈。他能熟练使用 Excel 和通用 AI 工具，但不一定会编程。他希望快速看到关键问题，又担心 AI 错误分类、无依据总结和不可解释的优先级。

核心诉求：**效率不能以失去证据和决策控制权为代价。**

## 5. User Stories

### US-01 创建项目

作为产品经理，我希望创建独立的用户研究项目，以便按产品、版本或研究目标管理反馈分析。

**验收标准**

- 必填项：Project Name、Product Name、Analysis Goal；
- 可选项：Product Type、Data Source、Language；
- Project Name 在当前工作区内不可为空，首尾空格自动移除；
- 创建成功后进入该项目的 Upload Data 页面；
- 创建失败时保留输入并显示可操作的错误信息。

### US-02 上传数据

作为产品经理，我希望上传 CSV/XLSX 文件，以便导入已有反馈。

**验收标准**

- 支持 `.csv`、`.xlsx`；MVP 设计限制为 ≤10 MB、≤5,000 个数据行；
- 一个分析批次只接受一个文件；不解析隐藏表或合并单元格；
- XLSX 包含多个工作表时，用户必须选择一个工作表；
- 系统校验扩展名、可读性、文件大小、空文件和行数；
- 校验失败不会创建分析批次，用户可重新上传。

### US-03 数据预览与字段映射

作为产品经理，我希望分析前预览数据并确认字段，以避免分析错误数据。

**验收标准**

- 展示检测到的总行数、列名和前 20 行；
- `Feedback Content` 为唯一必填映射；`ID`、`Rating`、`Date`、`Source` 可选；
- 系统可建议映射，但用户必须能修改；
- Feedback Content 为空的行标记为无效，不提交 AI；
- 映射完成后展示有效、无效和重复行数量；
- 只有必填映射有效且至少存在一条有效反馈时，才能开始分析。

### US-04 执行 AI 分析

作为产品经理，我希望 AI 自动分析反馈，以快速理解用户正在讨论的问题。

**验收标准**

- 逐步显示 Data Cleaning、Feedback Classification、Sentiment Analysis、Pain Point Extraction、Clustering、Requirement Extraction、Opportunity Discovery；
- 显示已处理 / 总有效反馈数，不用虚假的精确剩余时间；
- 单条失败不阻断整个批次；
- 用户离开页面后可从项目恢复查看进度；
- 完成后展示成功、失败、低置信度和跳过数量；
- 失败项可单独重试，不重复处理已成功项。

### US-05 查看用户痛点

作为产品经理，我希望查看主要用户痛点，以识别优先关注的问题。

**验收标准**

- 每个痛点展示名称、反馈数、占有效反馈比例、严重度和置信度；
- 排序默认按反馈数，可按严重度、占比或优先级切换；
- 同一反馈可支持多个痛点，占比之和因此不要求等于 100%；
- 低置信度痛点明确标识；
- 点击卡片进入 Pain Point Detail。

### US-06 查看 Evidence

作为产品经理，我希望查看洞察对应的原始反馈，以判断 AI 结论是否可信。

**验收标准**

- Pain Point、Requirement、Opportunity 和 PRD 事实性结论均可追溯至 Feedback ID；
- Evidence 显示原文及可用的 Rating、Date、Source；
- 默认展示代表性证据，并允许查看全部关联反馈；
- 用户可将错误关联移除或补回；
- 没有有效 Evidence 的洞察不进入可见结果。

### US-07 评估需求优先级

作为产品经理，我希望系统综合用户反馈和业务因素生成可解释的优先级建议，以支持 Roadmap 决策。

**验收标准**

- 展示 Frequency、Severity、User Impact、Business Value、Confidence 五项 0–100 分；
- Business Value 默认 50，仅由 PM 调整；
- AI 建议值、公式计算值与人工修改值分别保留；
- 修改 Business Value 后实时重算分数；
- PM 可 Override P0–P3，系统记录原建议、人工值和修改时间；
- 页面明确说明评分未自动纳入战略契合度、开发成本和依赖风险。

### US-08 生成 PRD Draft

作为产品经理，我希望将已确认的 Product Opportunity 转换为 PRD 草稿，以减少重复整理。

**验收标准**

- 仅能基于已确认且有 Evidence 的 Opportunity 生成；
- 输出 Background、Problem Statement、User Evidence、User Need、Product Goal、Success Metrics、User Stories、Functional Requirements、Edge Cases、Analytics 和 Acceptance Criteria；
- 生成内容可编辑、重新生成、复制和导出 Markdown；
- 重新生成前提示可能覆盖未保存的 AI 草稿；用户编辑内容不得被静默覆盖；
- Evidence 引用保留 Feedback ID；推测性方案必须标记为建议；
- MVP 不支持 PDF、发布或第三方同步。

## 6. Information Architecture

```text
InsightFlow
├── 01 Dashboard (current project overview)
├── 02 Projects
├── 03 Create Project
├── 04 Upload Data
├── 05 Analysis
│   ├── Overview
│   ├── Feedback
│   ├── Pain Points
│   ├── Sentiment
│   └── Requirements
├── 06 Pain Point Detail
├── 07 Requirements
└── 08 PRD Generator
```

MVP Demo 不要求真实认证。首次进入且没有项目时显示 Projects Empty State；选择项目后，Dashboard 始终表示**当前项目**而不是跨项目汇总。

## 7. Main User Flow

```text
Projects → New Project → Project Information → Upload Dataset
→ File Validation → Field Mapping → Preview → Start Analysis
→ AI Processing → Analysis Overview → Pain Point Detail → Evidence
→ Create Requirement → Priority Review → Product Opportunity
→ Generate PRD → Edit / Export Markdown
```

完整异常分支见 `02_Design/User_Flow.md`。

## 8. Feature Requirements

### 8.1 Projects

**Projects 页面**展示项目名称、产品名、状态、反馈数、洞察数和最近更新时间，提供 `+ New Project`。状态包括 Draft、Ready to Analyze、Analyzing、Completed、Completed with Errors、Failed。

**Create Project 页面字段**

| 字段 | 必填 | 规则 |
| --- | --- | --- |
| Project Name | 是 | 1–80 字符 |
| Product Name | 是 | 1–80 字符 |
| Product Type | 否 | SaaS / Mobile App / E-commerce / AI Product / Content / Other |
| Analysis Goal | 是 | 1–500 字符 |
| Data Source | 否 | App Store / Survey / Customer Service / Social Media / Community / Other |
| Language | 否 | Auto-detect（默认）或用户指定 |

### 8.2 Upload & Mapping

上传页分四步：Select File、Validate、Map Fields、Preview & Confirm。系统生成内部 `feedback_id`；若源文件 ID 缺失或重复，不依赖它作为主键。日期解析失败、评分越界等可选字段错误不会丢弃反馈正文，但需要在预览中提示。

去重仅标记完全相同或规范化后相同的文本，MVP 默认保留并提示，不擅自删除语义相似反馈。

### 8.3 AI Processing State

处理页展示阶段状态：Pending、Running、Completed、Completed with Warnings、Failed。用户可以安全离开页面；再次进入时读取持久化批次状态。MVP 不提供中途取消，以避免部分状态定义膨胀。

### 8.4 Dashboard

顶部显示项目名称、分析批次和更新时间。核心卡片：Total Valid Feedback、Negative Feedback、AI Insights、High Priority。

主要模块：

- Top Pain Points：名称、占比、数量、严重度；
- Sentiment Trend：Positive / Neutral / Negative，可切换 7/30/90 天；无有效日期时隐藏时间切换并显示整体分布；
- Requirement Priority：需求名称、AI Recommendation、Manual Priority；
- Analysis Quality：失败项、低置信度项和可追溯率。

空数据、处理中、完成但有错误和加载失败分别有独立状态。

### 8.5 Analysis & Feedback

Analysis 顶部展示有效反馈数、洞察数和负面占比。Tabs 为 Overview、Feedback、Pain Points、Sentiment、Requirements。

Feedback 列表展示原文、Category、Sentiment、Intent、Feature、Severity、Pain Point、User Need 和 Confidence。用户可查看模型原始值并修改可编辑字段；修改值独立保存，并标记 `Human edited`。

### 8.6 Pain Point Detail

展示 AI Summary、反馈数、占比、Severity、Confidence、Evidence、子主题比例、User Need 和 Opportunity。代表性 Evidence 必须同时覆盖主要子主题，不能只展示最相似的重复文本。

`Create Requirement` 只有在 Pain Point 已被 PM 确认且至少关联一条有效反馈时可用。

### 8.7 Requirements & Priority

Requirements 表格展示 Requirement、Feedback、Severity、Impact、Score、AI Recommendation 和 Manual Priority。点击行打开评分详情及证据。

PM 可调整 Business Value、编辑 Requirement、Override Priority、接受或拒绝需求。拒绝不会删除来源 Pain Point 和 Evidence。

### 8.8 Opportunity

Opportunity 包含 Insight、User Need、Requirement、Solution Directions、Risks、Priority 和 Evidence。Solution Directions 是探索建议，不是已批准方案。PM 确认后才能生成 PRD。

### 8.9 PRD Generator

双栏布局：右侧为不可丢失的 Source Context，左侧为可编辑 PRD。支持 Regenerate、Edit、Copy、Export Markdown。草稿状态包含 Generating、Generated、Edited、Generation Failed。

## 9. AI System Design

系统采用五个逻辑处理模块，而非五个必须自治运行的 Agent：

1. Feedback Analyzer：单条反馈结构化；
2. Pain Point Analyzer：跨反馈聚类与痛点归纳；
3. Requirement Module：从证据和痛点推导底层需要与候选需求；
4. Priority Module：AI 产出语义评分，确定性算法计算 Priority；
5. Opportunity / PRD Module：生成机会、方案方向和 PRD 草稿。

模块输入输出、重试和 Evidence 传播见 `03_AI/Agent_Design.md`。

## 10. AI Output Schema

核心对象为 Project、Analysis Batch、Feedback Analysis、Pain Point、Requirement、Opportunity、PRD Draft 和 Processing Error。所有对象使用稳定 ID 引用，原始文本不可被 AI 输出覆盖。

Schema、枚举、约束和示例见 `03_AI/AI_Output_Schema.md`。

## 11. Priority Algorithm

```text
Priority Score =
Frequency Score × 0.30
+ Severity Score × 0.25
+ User Impact × 0.20
+ Business Value × 0.15
+ Confidence × 0.10
```

所有输入限制在 0–100，最终结果四舍五入为整数。

### Frequency Score

```text
Requirement Feedback Count / Highest Requirement Feedback Count × 100
```

同一批次没有有效需求时不计算。最高需求得 100；没有 Evidence 的需求不能参与计算。

### Severity Score

基于关联反馈严重度聚合，默认映射：Critical 100、High 80、Medium 50、Low 20。聚合规则采用关联反馈分数的加权高分位策略，具体实现需在 Evaluation 中验证，避免单条异常或平均值掩盖严重问题。

### User Impact

AI 评估受影响工作流的广度和阻断程度：High 90、Medium 60、Low 30，并提供理由与 Evidence。不是用户数量的重复计分。

### Business Value

默认 50，仅由 PM 调整。AI 可提示需要考虑的商业因素，但不修改此值。

### Confidence

MVP 使用可解释的离散等级：High 90、Medium 60、Low 30。由样本充分性、聚类一致性和分类置信度共同支持；不得虚构数学精度。

### Priority Band

| Score | AI Recommendation |
| ---: | --- |
| 85–100 | P0 |
| 65–84 | P1 |
| 40–64 | P2 |
| 0–39 | P3 |

Manual Override 独立保存，不反向篡改 `priority_score` 或 `ai_recommendation`。

## 12. Error Handling

| 场景 | 系统行为 | 用户恢复方式 |
| --- | --- | --- |
| 文件格式、大小或行数不合法 | 不创建批次，显示具体约束 | 重新选择文件 |
| 未找到 Feedback Column | 阻止开始分析并定位字段映射 | 手动选择内容列 |
| 存在空正文或可选字段错误 | 跳过空正文；保留正文有效行并提示字段问题 | 返回预览修正映射 |
| 部分 AI 请求失败 | 保存成功结果，显示成功/失败数量 | Retry Failed |
| JSON 不符合 Schema | 自动纠正/重试，最多 2 次 | 仍失败则标记 Processing Failed |
| AI 洞察无 Evidence | 不发布该洞察并记录验证错误 | 重试模块或人工检查 |
| Low Confidence | 保留但显著标记，不进入自动高优先级结论 | PM 审核、编辑或拒绝 |
| PRD 生成失败 | 保留 Source Context 与已有编辑 | Retry Generation |

任何失败均不得伪装成成功，也不得静默丢弃用户已经完成的编辑。

## 13. Product Metrics

| Metric | 定义 | MVP Target |
| --- | --- | ---: |
| Insight Acceptance Rate | 直接接受或编辑后接受 / 已审核洞察 | ≥80% |
| Batch Processing Success Rate | 合法结构化结果 / 有效输入反馈 | ≥95% |
| Insight Traceability Rate | 至少一条有效 Evidence 的洞察 / 可见洞察 | 100% |
| Core Task Completion Rate | 完成上传、理解、下钻和导出任务的测试用户比例 | ≥80% |
| Time-on-task | 同一数据集使用与不使用产品的任务时间差 | 建立基线后验证下降 |

## 14. AI Evaluation Metrics

- 多标签分类：人工抽检准确率目标 ≥85%，并记录 Precision、Recall、F1；
- Requirement Extraction：人工评审通过率目标 ≥80%；
- Hallucination Rate：无 Evidence 支持的事实性陈述 / 已审核事实性陈述，目标 <5%；
- Evidence Precision：随机抽检的 Evidence 是否真实支持对应结论；
- Schema Validity Rate：首次或重试后通过 Schema 的输出比例；
- Low-frequency Critical Recall：低频严重问题是否被识别，防止只优化高频主题。

## 15. Non-functional Requirements

- **Explainability：** 关键结论包含 Evidence、评分理由和来源模块；
- **Reliability：** 所有 AI 输出通过 Schema Validation；支持幂等重试，避免重复对象；
- **Privacy：** 上传前披露第三方 LLM 数据路径；MVP 数据不用于训练；后续定义脱敏和留存策略；
- **Performance：** 5,000 行任务异步处理，UI 不阻塞；具体完成时间在真实模型与成本测试后确定；
- **Accessibility：** 进度、优先级和失败状态不能只依赖颜色；键盘可操作核心流程；
- **Auditability：** 保存 AI 原始值、人工修改值、时间和对象关系；
- **Localization：** MVP 支持中英文反馈分析，界面语言先保持一致；混合语言能力需评估。

## 16. MVP Scope

### In Scope

项目创建、单文件 CSV/XLSX 上传、预览与字段映射、批量 AI 分析、Feedback 结构化、痛点聚类、Evidence、需求提取、透明优先级、Opportunity、PRD 草稿和 Markdown 导出。

### Out of Scope

真实认证、多人协作、复杂权限、自动抓取、实时分析、Jira/飞书/Slack 集成、PDF 导出、多模态反馈、AI 自动发布或自动决定 Roadmap。

## 17. Future Roadmap

后续能力只有在 MVP 证明核心闭环有效后评估：

1. 数据连接器与增量分析；
2. 团队协作、审批与权限；
3. 跨批次趋势和版本对比；
4. Jira、飞书、Slack 等工作流集成；
5. 自定义分类体系、评分模型和组织级评估集。

## Day 2 PRD Completion Checklist

- [x] 完整产品目标与 MVP 边界
- [x] 8 个核心 User Stories 及验收标准
- [x] 8 个核心页面与关键状态
- [x] 主 User Flow 与异常恢复
- [x] Feedback → Pain Point → Requirement 数据链路
- [x] Priority Score 公式与人工 Override
- [x] AI 模块、Schema、Evidence 与失败机制引用

