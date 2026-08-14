# InsightFlow User Flow

## 1. Scope

本文定义 MVP 从创建项目到导出 PRD Markdown 的主流程、页面跳转、关键状态和异常恢复。Dashboard 均指当前项目 Dashboard；MVP 不包含登录、协作、外部集成或自动抓取。

## 2. Primary Flow

```text
Start
  ↓
Projects
  ├─ Has Project → Select Project → Project Dashboard
  └─ No Project / New Project
       ↓
Create Project
       ↓
Project Information Validation
  ├─ Invalid → Inline Error → Correct Form
  └─ Valid
       ↓
Upload Dataset
       ↓
File Validation
  ├─ Invalid → Explain Constraint → Replace File
  └─ Valid
       ↓
Select Sheet (XLSX with multiple sheets only)
       ↓
Field Mapping
  ├─ Feedback Content Missing → Select Required Column
  └─ Valid Mapping
       ↓
Data Preview
  ├─ No Valid Rows → Return to Mapping / Replace File
  └─ Confirm Valid, Invalid and Duplicate Counts
       ↓
Start AI Analysis
       ↓
AI Processing
  ├─ Feedback Analyzer
  ├─ Pain Point Analyzer
  ├─ Requirement Module
  ├─ Priority Module
  └─ Opportunity Module
       ↓
Analysis Result
  ├─ Completed
  ├─ Completed with Errors → Review Result / Retry Failed
  └─ Failed → Retry Eligible Steps
       ↓
Project Dashboard / Analysis
       ↓
Pain Point Detail
       ↓
Evidence Review
  ├─ Reject / Edit Insight
  └─ Confirm Pain Point
       ↓
Create Requirement
       ↓
Priority Review
  ├─ Adjust Business Value
  ├─ Accept AI Recommendation
  └─ Manual Priority Override
       ↓
Product Opportunity
  ├─ Edit / Reject
  └─ Confirm
       ↓
Generate PRD Draft
  ├─ Generation Failed → Retry
  └─ Generated → Edit
       ↓
Copy / Export Markdown
       ↓
End
```

## 3. Navigation Model

| From | Action | To | Guard |
| --- | --- | --- | --- |
| Projects | New Project | Create Project | 无 |
| Create Project | Create Project | Upload Data | 必填字段有效 |
| Projects | Select Project | Dashboard | 项目存在 |
| Dashboard | Upload Data | Upload Data | 项目存在 |
| Upload Data | Start AI Analysis | AI Processing | 文件、映射和有效行校验通过 |
| AI Processing | View Results | Analysis | 至少一条反馈成功 |
| Analysis | Select Pain Point | Pain Point Detail | Pain Point 可见且有 Evidence |
| Pain Point Detail | Create Requirement | Requirement Detail | Pain Point 已确认 |
| Requirements | Select Requirement | Priority Detail | Requirement 存在 |
| Opportunity | Generate PRD | PRD Generator | Opportunity 已确认且有 Evidence |

## 4. Page States

### 4.1 Projects

- **Empty：** 解释价值并突出 `Create first project`；
- **Populated：** 展示项目卡片及状态；
- **Load Error：** 提供 Retry，不伪装为空列表。

### 4.2 Create Project

- **Pristine：** 未提交表单；
- **Validation Error：** 在字段旁说明错误并保留输入；
- **Submitting：** CTA 防重复点击；
- **Create Failed：** 保留全部输入，允许重试。

### 4.3 Upload Data

- **No File、Validating、Invalid、Ready to Map、Ready to Analyze**；
- 更换文件会清除旧映射，操作前提示；
- 多工作表 XLSX 必须先选 Sheet；
- 可选字段错误显示 Warning，必填内容错误显示 Blocking Error。

### 4.4 AI Processing

- **Pending、Running、Completed、Completed with Errors、Failed**；
- 展示模块级状态和处理计数；
- 刷新或离开不丢失服务端进度；
- Retry Failed 只处理失败项，并保持对象 ID 幂等。

### 4.5 Analysis / Dashboard

- **No Analysis：** 引导上传；
- **Processing：** 展示入口和最新进度；
- **Completed：** 展示全部模块；
- **Completed with Errors：** 展示可用结果及质量提示；
- **No Date Data：** Sentiment 只展示整体分布，不显示虚假趋势；
- **No Visible Insights：** 解释可能原因并引导查看失败或低置信度项。

### 4.6 Pain Point & Evidence

- **Confirmed、Needs Review、Human Edited、Rejected**；
- 移除 Evidence 后若数量变为 0，对象自动转为不可发布状态；
- Evidence 原文始终保留，不被 AI 摘要替换。

### 4.7 PRD Generator

- **Ready、Generating、Generated、Edited、Generation Failed**；
- 有用户编辑时，Regenerate 必须先确认；
- 失败不清除 Source Context 或已保存编辑；
- 导出只包含当前保存版本及 Evidence 引用。

## 5. Upload and Validation Flow

```text
Choose File
  ↓
Check Extension → Check Readability → Check Size → Check Row Count
  ↓
Read Headers / Sheets
  ↓
Suggest Field Mapping
  ↓
User Confirms Feedback Content
  ↓
Normalize Preview Only
  ↓
Count Valid / Empty / Invalid Optional Fields / Exact Duplicates
  ↓
Confirm and Create Analysis Batch
```

校验优先在开始 AI 分析前完成。空 Feedback Content 行不发送给模型；可选字段解析失败不阻断正文分析；完全重复项默认保留并标记，避免系统擅自改变用户数据。

## 6. Analysis and Partial Failure Flow

```text
Valid Feedback Items
  ↓
Process in Batches
  ├─ Valid Schema + Evidence → Persist Success
  └─ Invalid / Request Error
       ↓
     Corrective Retry 1
       ↓
     Corrective Retry 2
       ├─ Success → Persist Success
       └─ Failed → Persist Processing Error
  ↓
Continue Remaining Items
  ↓
Aggregate Only Valid Results
  ↓
Publish Only Insights with Evidence
```

完成状态规则：

- 全部有效项成功：`Completed`；
- 至少一项成功且至少一项失败：`Completed with Errors`；
- 无任何可用结果：`Failed`。

## 7. Insight Review Flow

```text
Open Pain Point
  ↓
Read Summary + Breakdown + Confidence
  ↓
Open Representative Evidence
  ↓
View All Evidence
  ├─ Incorrect Link → Remove Association
  ├─ Missing Link → Restore / Add Association
  ├─ Incorrect Wording → Edit Insight
  ├─ Unsupported → Reject
  └─ Supported → Confirm
```

系统分别记录 AI 原始值和 PM 修改值。接受、编辑后接受、拒绝均进入 Insight Acceptance Rate 的已审核分母。

## 8. Priority Review Flow

```text
Open Requirement
  ↓
Review Evidence and Five Score Inputs
  ↓
System Calculates AI Recommendation
  ↓
PM Adjusts Business Value (optional)
  ↓
System Recalculates Score
  ↓
PM Accepts or Overrides Priority
  ↓
Save AI Recommendation + Manual Priority + Audit Data
```

人工 Override 不修改原始分数。页面需说明战略、成本、依赖和法规等因素仍需 PM 判断。

## 9. PRD Generation Flow

```text
Confirmed Opportunity + Evidence + Priority
  ↓
Build Structured Source Context
  ↓
Validate Context References
  ├─ Missing Evidence → Block Generation
  └─ Valid
       ↓
Generate PRD Schema
       ↓
Validate Output
  ├─ Invalid → Retry up to 2 times
  ├─ Failed → Preserve Context and Show Retry
  └─ Valid → Render Editable Draft
       ↓
Save → Copy / Export Markdown
```

## 10. Flow Invariants

1. 原始 Feedback 不被 AI 输出覆盖；
2. 可见 Insight 至少有一条有效 Evidence；
3. 下游对象只能引用已持久化的上游 ID；
4. AI 原始值与人工修改值分开保存；
5. AI 语义判断不直接决定 P0–P3；
6. 单项失败不升级为整批失败；
7. 重试不创建重复成功对象；
8. 未确认 Opportunity 不能生成 PRD。

## Day 2 User Flow Checklist

- [x] 主流程
- [x] 文件与字段校验分支
- [x] AI 部分失败与重试
- [x] Evidence 审核
- [x] Priority 人工调整与 Override
- [x] PRD 生成、编辑和导出

