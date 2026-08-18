# InsightFlow 项目证据索引

## 产品定义

- [Product Brief](../01_Product/Product_Brief.md)：目标用户、JTBD、MVP Scope
- [PRD](../01_Product/PRD.md)：功能边界、验收标准、失败状态
- [User Research](../01_Product/User_Research.md)：问题背景与场景假设

## 设计与交互

- [User Flow](../02_Design/User_Flow.md)：Upload → Analyze → Evidence → PRD
- [Design System](../02_Design/Design_System.md)：Token、组件和状态
- [Figma Link](../02_Design/Figma_Link.md)：最终设计文件

## AI 与评测

- [Agent Design](../03_AI/Agent_Design.md)：模块化 AI Processing Flow
- [AI Output Schema](../03_AI/AI_Output_Schema.md)：结构化输出和 Evidence ID
- [Evaluation](../03_AI/Evaluation.md)：100 条合成评测集、V1–V3 对比
- [Evaluation Methodology](../03_AI/Evaluation_Methodology.md)：指标计算方法
- [Bad Case Log](./BAD_CASE_LOG.md)：真实错误样例与迭代方向

## 工程与部署

- [Day 4 Report](../05_App/DAY4_REPORT.md)：前端闭环和 Mock Data
- [Day 5 Report](../05_App/DAY5_REPORT.md)：Live AI Pipeline
- [Day 6 Report](../05_App/DAY6_REPORT.md)：Evaluation 与 Prompt 优化
- [Day 7 Report](../05_App/DAY7_REPORT.md)：GitHub、CloudBase 和 Demo 交付
- [CloudBase Deployment](../05_App/CLOUDBASE_DEPLOYMENT.md)：部署配置和健康检查

## 走查与限制

- [Task Walkthrough](./TASK_WALKTHROUGH.md)：无真人测试条件下的固定任务走查
- [MVP Validation Plan](./MVP_VALIDATION_PLAN.md)：后续真人验证和证据链计划
- [Validation Report 2026-08-18](./VALIDATION_REPORT_2026-08-18.md)：工程验证、13 路由 QA 与离线评测复核

## 证据边界

当前可以证明：

- 产品闭环已实现并可演示
- AI Pipeline 有结构化输出、Schema Validation、Evidence Tracking 和确定性 Priority
- 100 条合成数据上完成了 Prompt V1–V3 自动评测
- 记录了可复核的 V3 Bad Cases

当前不能证明：

- 真实用户采纳率
- 商业客户使用效果
- 长期留存或效率提升
- 真人对 PRD Draft 的满意度
