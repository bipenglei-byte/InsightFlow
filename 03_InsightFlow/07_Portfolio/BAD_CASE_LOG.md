# InsightFlow Bad Case 档案

> 来源：`04_Data/evaluation/error_cases_v3.csv`、`Evaluation.md`。这些是可复核的模型错误记录，不是为了包装结果而虚构的案例。

## 已归档案例

| Case | 输入摘要 | 预期 | 实际 | 原因 | 下一步 |
|---|---|---|---|---|---|
| EV_008 | Pro 套餐涨价，用户认为太贵 | Medium Severity | Low | 严重程度低估 | 收紧工作流影响和严重程度边界 |
| EV_009 | 价格页清楚解释所有方案 | Pricing | Content | Category 边界混淆 | 增加 Pricing / Content 决策规则 |
| EV_011 | 客服五分钟解决登录问题 | Customer Service | Pricing | 服务语义被错误映射 | 增加 Customer Service 反例 |
| EV_012 | 账单工单六天未回复 | Customer Service | UX | 支持流程被当成体验问题 | 增加支持场景优先判断 |
| EV_014 | 希望自定义侧边栏顺序 | Suggestion | Request | Intent 边界不清 | 明确 complaint / request / suggestion 顺序 |
| EV_015 | Sync 偶尔复制同一条笔记 | Medium Severity | High | 偶发故障被高估 | 增加频率与影响联合规则 |
| EV_017 | 教程指向已不存在的菜单 | Content | UX | 内容问题与 UX 问题重叠 | 增加过期内容判定规则 |

## Bad Case 分析方法

每条新案例都必须记录：

1. 原始输入和完整模型输出
2. 黄金标签或人工判断依据
3. 错误类型：Schema、Category、Intent、Severity、Evidence、Need 或 Priority
4. 根因假设，而不是只写“模型不够聪明”
5. Prompt、Schema、算法或 UI 的具体改动
6. 在同一评测集和回归集上的复测结果

## 当前主要问题模式

- Category 边界：Pricing、Content、UX、Customer Service 易混淆
- Severity 边界：Medium / High / Low 存在低估或高估
- Intent 边界：Suggestion 与 Request 需要更明确的决策顺序
- Confidence：高置信区间仍未校准，不能直接当概率解释
- Pain Point / User Need：当前已有 AI-assisted proxy review，但还不是独立人工审核

## 诚实口径

可写：

> 基于 V3 错误案例进行分类边界、严重程度规则和意图判定迭代。

不可写：

> 已通过真实用户验证证明模型准确理解所有反馈。
