# InsightFlow 标准任务走查记录

> 目的：在暂时无法开展真人用户测试时，用固定输入、固定步骤和可复核输出验证 MVP 的核心闭环。本文不等同于真人用户研究。

## 走查条件

- 产品版本：CloudBase `insightflow-004` / 本地对应 commit `d3d793f`
- 数据集：NovaNote V3.2 Demo Dataset
- 目标视口：1440px Desktop
- 走查日期：2026-08-18
- 参与者：项目作者单人标准化走查
- 证据类型：页面截图、路由结果、测试命令、结构化输出和错误状态

## 固定任务清单

| ID | 任务 | 预期结果 | 证据位置 | 状态 |
|---|---|---|---|---|
| T01 | 创建研究项目 | 必填校验生效并进入上传 | `/projects/new` | 已实现 |
| T02 | 上传 CSV/XLSX | 文件格式、大小、行数和预览可见 | `/projects/new/upload` | 已实现 |
| T03 | 完成字段映射 | Feedback Content 未映射时禁止分析 | `/projects/new/mapping` | 已实现 |
| T04 | 启动分析 | Pipeline 展示阶段、进度和失败状态 | `/processing` | 已实现 |
| T05 | 查看痛点 | Pain Point 有数量、占比、严重程度和置信度 | `/projects/nova-v32/analysis` | 已实现 |
| T06 | 回溯证据 | Insight 可回到 supportingFeedbackIds 和原文 | `/pain-points/:id`、`/evidence/:id` | 已实现 |
| T07 | 审核优先级 | Business Value 改变后 Score 实时重算 | `/requirements/:id` | 已实现 |
| T08 | 人工覆盖 | AI Recommendation 与 PM Final Decision 同时保留 | `/requirements/:id` | 已实现 |
| T09 | 生成 PRD | Source Context 与可编辑 Draft 同屏 | `/prd/:id` | 已实现 |
| T10 | 处理失败 | Partial Failure 支持 Retry Failed，不丢失成功结果 | `/processing`、Analysis | 已实现 |

## 2026-08-18 自动化走查结果

- 13 个核心路由均可加载
- 禁止出现的英文界面文案：0
- 检测到的横向布局溢出：0
- Evidence ID 校验、Priority 公式边界和 Retry 合并由 18 个单元测试覆盖
- 浏览器脚本当前验证页面可达性、中文化和布局；上传文件与完整交互链路仍需后续将旧版英文 `day4_qa.cjs` 重写为中文选择器后再自动化

详细结果见 [Validation Report](./VALIDATION_REPORT_2026-08-18.md)。

## 走查记录模板

每次版本走查都应补充：

```text
版本：
日期：
任务 ID：
输入：
操作步骤：
预期结果：
实际结果：
是否阻塞：
截图 / 日志：
后续动作：
```

## 当前结论

标准任务走查可以证明产品闭环和失败路径可运行，但不能证明目标用户愿意使用、输出可以采纳或实际节省了多少时间。上述结论必须等真人测试后再补充。
