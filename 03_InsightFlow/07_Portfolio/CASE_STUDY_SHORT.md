# InsightFlow — Short Case Study

## Problem

产品经理面对 App 评论、问卷和客服记录时，真正的瓶颈不是收集反馈，而是把大量非结构化内容转换成可信的产品决策。人工阅读、Excel 分类、统计和总结不仅耗时，也容易失去原始语境。

## Solution

InsightFlow 提供 Upload → Analyze → Understand → Prioritize → Act 的闭环。PM 上传 CSV/XLSX、确认字段映射后，系统把反馈结构化为 Category、Intent、Sentiment、Feature、Severity 和 Confidence，再聚合 Pain Point、提取 User Need 与 Requirement，并生成 Product Opportunity 和可编辑 PRD Draft。

## Core UX

产品最重要的交互不是 AI Summary，而是 Supporting Evidence。每个 Pain Point 都绑定 `supportingFeedbackIds`，PM 可以从 Insight 回到原始反馈。Priority 页面把 Frequency、Severity、User Impact、Business Value 与 Confidence 分开显示；Business Value 由 PM 调整，Manual Override 同时保留 AI Recommendation 和最终人工决策。

## AI Architecture

系统没有使用一个大 Prompt 完成所有任务，而是拆成可控的 Processing Modules：Feedback Analyzer、Schema Validation、Pain Point Consolidation、Evidence Mapping、Requirement Extraction、Priority Algorithm 与 Opportunity/PRD。LLM 负责语义判断，Zod 与代码负责数据契约、Evidence 校验和确定性计算。

## Evaluation

100 条合成标注数据比较了 Prompt V1–V3。V3 在 `Qwen/Qwen3.5-4B` 上取得 Category 70%、Intent 85%、Sentiment 95%、Severity 75% 和 0% Schema Failure，因此被选为当前版本。另有 100 条 AI-assisted proxy review，Pain Point 为 72.5%、User Need 为 70.0%，但它不等同于人工评估。

## Result

项目完成了从产品定义、Figma 到可运行 MVP、Live AI Pipeline 和 Evaluation Framework 的端到端闭环。它没有声称未经验证的商业提效；当前真实成果是可演示的 Upload-to-PRD 产品流程、Evidence Traceability、确定性优先级与可复现评估。下一步是扩大数据集、完成真正人工审核、校准 Confidence，并加入生产持久化。

