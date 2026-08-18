# InsightFlow MVP 验证与证据链优化方案

## 1. 项目定位升级

InsightFlow 不应被描述为“一个 AI 分析 Demo”，而应被定义为：

> 面向产品经理用户研究场景的 AI Insights MVP。它将 CSV/XLSX 用户反馈转换为可追溯的用户痛点、User Need、需求优先级、产品机会和 PRD Draft，并通过离线评测与小规模真人任务测试验证可用性。

项目类型：个人 MVP / 验证项目，不宣称已有商业客户或生产规模。

核心假设：

1. AI 可以减少用户反馈整理、分类和总结的重复工作。
2. Evidence First 可以让 PM 审核 AI 洞察，而不是被迫接受黑盒结论。
3. “AI 语义判断 + 确定性算法 + PM 最终决策”比单次大 Prompt 更可控。

## 2. 当前证据盘点

### 已有证据

- PRD、User Flow、Agent Design、AI Output Schema
- 可运行的 Next.js MVP 和 CloudBase Demo
- Demo Mode 与 Live AI Mode
- CSV/XLSX 上传、字段映射、分析、Evidence、Priority、PRD 闭环
- Prompt V1/V2/V3 与离线评测资料
- 100 条合成标注反馈评测集
- V3 离线结果：Category 70%、Intent 85%、Sentiment 95%、Severity 75%、Schema Failure Rate 0%
- 100 条 AI-assisted proxy review：Pain Point 72.5%、User Need 70.0%、代理标记 Hallucination Rate 7%
- Partial Failure、Retry、Low Confidence、Insufficient Evidence 等失败状态
- CloudBase 公网 Demo 与 GitHub 公开仓库

### 不应伪装成已有结果的内容

- 尚无真实客户数据或商业上线指标
- 尚无真人用户任务测试结果
- 尚无完成的人工定性审核表
- 尚无经过校准的 Confidence 与聚类质量指标
- 尚无长期留存、转化或效率提升数据

## 3. 真人用户验证计划

> 当前约束：暂时无法开展真人用户测试。本节作为未来验证计划保留，不计入现阶段项目成果，也不在简历中填写参与人数、采纳率或用户评分。

### 目标用户

邀请 5–10 名符合以下条件的参与者：产品经理、产品实习生、用户研究员，或近期处理过问卷、客服、应用商店反馈的求职者/从业者。

建议首轮样本：8 人。该数字是测试计划，不是已完成结果。

### 固定任务

每位参与者完成同一组任务：

| 任务 | 目标 |
|---|---|
| 上传反馈数据 | 判断文件校验、预览和字段映射是否易懂 |
| 查看用户痛点 | 判断 Top Pain Point 是否有帮助 |
| 查看 Supporting Evidence | 判断 AI 结论能否回溯到原始反馈 |
| 审核需求优先级 | 调整 Business Value 并设置 Manual Override |
| 生成 PRD Draft | 判断输出是否能减少整理工作 |

### 统一测试数据

使用脱敏的虚构 NovaNote 数据集，避免参与者使用不同数据导致结果不可比。真人测试记录中应保存：数据版本、反馈条数、测试日期和产品版本。

### 记录表

| 字段 | 说明 |
|---|---|
| participant_id | P01–P08，不记录敏感身份信息 |
| background | PM / 实习生 / 研究员等 |
| task | 固定任务编号 |
| completion | 完成 / 部分完成 / 未完成 |
| completion_time | 完成耗时 |
| accuracy | 是否理解 AI 结论及证据 |
| usefulness | 1–5 分 |
| adoption | 直接采纳 / 修改后采纳 / 不采纳 |
| friction | 卡点和困惑 |
| quote | 用户原话，需取得记录许可 |
| iteration | 对应的产品或 Prompt 改动 |

### 目标指标

以下是验证门槛，不是既成事实：

- 8 名参与者完成率 ≥ 80%
- Evidence 任务完成率 ≥ 90%
- 至少 75% 的参与者认为输出“可直接或修改后采纳”
- 需求评审任务中，至少 80% 的参与者能理解 AI Recommendation 与 Manual Override 的区别
- PRD 草稿可用性平均分 ≥ 3.5 / 5
- 每个关键任务至少记录 1 条正向反馈或 1 条明确问题

## 4. 离线评测方法补强

### 测试集结构

保留现有 100 条合成标注反馈，并按场景分层：

- 搜索与历史内容
- 稳定性与性能
- 价格与商业价值
- 导出与登录
- 一般 UX 与中性反馈

另为每类任务保留黄金标签：Category、Intent、Sentiment、Severity、Pain Point、User Need 和 Evidence ID。

### 评分维度

| 维度 | 计算方式 |
|---|---|
| Schema Validity | JSON 是否通过 Zod Schema |
| Classification Accuracy | 预测枚举与黄金标签完全匹配比例 |
| Evidence Precision | 输出引用的反馈是否真正支持该洞察 |
| Evidence Coverage | 应引用的反馈中被正确引用的比例 |
| User Need Quality | 盲评 1–5 分，是否抽象出 underlying need |
| Requirement Quality | 盲评 1–5 分，是否没有把 Feature Request 原样当需求 |
| Priority Consistency | 相同输入是否产生相同确定性 Score |
| Failure Recovery | 部分失败、Schema 错误是否可重试并保留成功结果 |

### 报告口径

简历或作品集中应写清：样本规模、任务类型、评分维度、模型版本、Prompt 版本和评测日期。不要只展示一个总体百分比。

## 5. Bad Case 计划

真实项目必须主动展示失败案例。建议至少沉淀 6–8 条，格式如下：

| Bad Case | 原因假设 | 迭代动作 | 验证方式 |
|---|---|---|---|
| 泛化反馈被错误聚成高优先级痛点 | 负面词触发过强 | 增加证据数量和聚类一致性门槛 | 重新跑分层测试集 |
| Feature Request 被原样当作 Requirement | 未抽取 underlying need | 增加 Requirement Agent 约束和反例 | User Need 盲评 |
| 多问题反馈只保留一个主题 | 单条反馈拆分不足 | 增加多主题标记与证据关联 | Multi-intent 子集 |
| 低样本洞察被正常展示 | Evidence threshold 不足 | 无足够证据时展示 Insufficient Evidence | 状态测试 |
| 置信度高但证据不一致 | Confidence 未校准 | 计算样本量、聚类一致性和分类置信度 | Calibration review |
| 需求分数受数据集大小影响 | 直接使用反馈数量 | 使用归一化 Frequency Score | 算法单元测试 |
| 部分请求失败导致整批失败 | 错误边界过粗 | 保存成功结果并支持 Retry Failed | 故障注入测试 |
| PRD 过于模板化 | 上下文和 Success Metrics 不足 | 强制引用 Evidence、Need 和 Priority | PRD 人工审核 |

## 6. Prompt / Pipeline 迭代记录

每次迭代记录以下内容，不只记录“Prompt 优化”：

| 版本 | 问题 | 改动 | 指标变化 | 是否保留 |
|---|---|---|---|---|
| V1 | 基础结构化输出 | 单模块 Prompt | 作为 baseline | 否 |
| V2 | 增加 Evidence 和 Need 约束 | 拆分输出字段 | 对比 V1 | 否/待复核 |
| V3 | 增加 Schema、Evidence、失败重试 | 模块化 Pipeline | 当前离线基线 | 是 |
| V4 | 待真人反馈后确定 | 只修复高频 Bad Case | 待测 | 待定 |

每个版本都要绑定：Prompt 文件、评测集版本、模型、运行时间和输出样例。

## 7. 作品集“项目证据链”模块

建议在案例页使用以下结构：

> 产品定义：PRD 1 份、User Flow 1 份、AI Processing Modules 5 个、Schema 3 组。  
> 工程实现：Next.js MVP 1 个、CloudBase Demo 1 个、CSV/XLSX 数据链路 1 条。  
> 模型验证：100 条分层离线评测集、Prompt V1–V3、Schema / Evidence / Priority 评估。  
> 用户验证：计划邀请 8 名目标用户完成 5 类任务，记录完成率、采纳率、可用性评分和问题原话。  
> 迭代沉淀：Bad Case 6–8 条、Prompt 迭代记录、失败状态和人工决策记录。

其中“用户验证”在完成前必须明确标注为计划，不得写成已完成结果。

## 8. 推荐简历表述

### 已完成版本

> InsightFlow｜AI User Research & Product Insights Agent MVP  
> 面向产品经理用户研究场景，负责需求定义、PRD、User Flow、AI Processing Modules、Evidence Tracking 和 Priority Algorithm；完成可运行的 Next.js + CloudBase MVP，将 CSV/XLSX 用户反馈转换为结构化痛点、需求优先级、产品机会和可编辑 PRD。基于 100 条分层合成评测集比较 Prompt V1–V3，V3 的 Schema Failure Rate 为 0%，Category / Intent / Sentiment / Severity 准确率分别为 70% / 85% / 95% / 75%；同时保留 Partial Failure、Retry、Low Confidence 和 Insufficient Evidence 状态。

### 真人验证完成后的补充句

> 邀请 [N] 名目标用户完成 [M] 类固定任务，收集 [K] 条有效反馈；[X]% 用户认为洞察可直接或修改后采纳，基于 [Y] 条 Bad Case 完成 [Z] 轮 Prompt 与流程迭代。

方括号内容必须由真实记录填入，不能提前填数字。

## 9. 30 天执行顺序

### 当前无用户测试条件下的替代路径

在无法招募目标用户时，优先完成以下可独立执行且可复核的验证：

1. **标准任务走查**：为 Upload → Mapping → Analysis → Evidence → Priority → PRD 建立固定任务脚本，记录每一步是否完成、耗时、错误状态与截图。
2. **启发式可用性检查**：依据状态可见性、系统反馈、错误恢复、用户控制、一致性和信息可读性检查核心流程，并保存问题与修改前后对比。
3. **离线黄金集复评**：人工复核现有 100 条评测集中的黄金标签，补充 Evidence Precision、Evidence Coverage 和 Requirement Quality。
4. **模型与 Prompt 对比**：固定模型、数据集和参数，对 V1–V3 输出进行版本对照，不选择性展示结果。
5. **Bad Case 档案**：至少记录 6 条真实运行失败或低质量输出，保存输入、输出、原因假设、修改和复测结果。
6. **故障注入测试**：验证格式错误、空文件、缺少反馈列、Schema 失败、Partial Failure、Retry 和 Insufficient Evidence。
7. **公开可复现证据**：保留 GitHub commit、测试命令、评测数据、CloudBase Demo、Figma 页面和版本日期。

完成上述工作后，项目可表述为“完成产品、工程和离线验证闭环”，但不能表述为“完成用户验证”。

### 第 1 周：验证准备

- 冻结测试版本和 Demo 数据集
- 招募 8 名目标用户
- 创建匿名反馈表和任务脚本
- 确定离线评测的黄金标签

### 第 2 周：真人任务测试

- 每人完成 5 类任务
- 记录完成率、耗时、采纳行为和原话
- 每天归档 1–2 条高价值 Bad Case

### 第 3 周：迭代与复测

- 按影响度和频次排序问题
- 只修复 P0/P1 问题
- 重新运行离线评测和真人复测
- 对比 V3 与 V4 的变化

### 第 4 周：作品集整理

- 更新 Evaluation.md、DAY7_REPORT.md 和案例页
- 增加验证表、Bad Case 表、Prompt 变更记录
- 为每个结果附上来源文件和日期
- 将未完成项保留在 Known Limitations

## 10. 完成判定

该项目可以从“Demo”升级为“有验证的 MVP”，需要同时满足：

- 有固定用户任务和目标用户定义
- 有匿名、可复核的真人反馈表
- 有离线评测方法和分层结果
- 至少 6 条 Bad Case 有原因和迭代动作
- 至少 1 次基于反馈的复测
- 简历数字均能回到原始记录
- 所有商业效果表述保持诚实，不把个人项目写成商业上线项目

### 暂无真人测试时的阶段性完成标准

- 核心流程有固定任务脚本和完整截图
- 离线评测集、黄金标签和计算方式可公开复核
- Prompt 版本变化能够对应到具体 Bad Case
- 至少 6 条 Bad Case 完成修改前后复测
- 失败状态和恢复路径有测试记录
- GitHub、Figma、线上 Demo 与文档版本一致
- Known Limitations 明确写明“尚未进行真人用户验证”
