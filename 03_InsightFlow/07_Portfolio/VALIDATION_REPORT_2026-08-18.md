# InsightFlow Validation Report — 2026-08-18

## 验证范围

本报告验证产品、工程、离线评测和可复现性，不代表真人用户测试或商业效果验证。

- 代码基线：`d3d793f` 之后的证据链文档更新工作区
- 应用：Next.js 16 / React 19
- 评测数据：`evaluation-dataset-v1`，100 条合成标注反馈
- 模型记录：SiliconFlow `Qwen/Qwen3.5-4B`，temperature 0.1
- 浏览器 QA：Microsoft Edge，1440 × 900

## 工程验证结果

| 检查 | 命令 | 结果 |
|---|---|---|
| 单元测试 | `pnpm test` | 18/18 通过，0 失败 |
| TypeScript | `pnpm typecheck` | 通过 |
| ESLint | `pnpm lint` | 通过 |
| Production Build | `pnpm build` | 通过，9 个静态/动态入口生成 |
| Release Audit | `pnpm audit:release` | 扫描 144 个文件，0 secret、0 private path |

## 浏览器走查结果

运行 `node scripts/qa-chinese-ui.cjs`，共检查 13 个核心路由：

- Dashboard
- Projects
- Create Project
- Upload
- Field Mapping
- Processing
- Analysis
- Pain Point
- Evidence
- Requirements
- Requirement Detail
- PRD
- Product States

结果：

```text
CHINESE_UI_ROUTES=13
FORBIDDEN_UI_COPY=0
LAYOUT_OVERFLOW=0
```

首次运行暴露出 `playwright` 未声明为开发依赖的问题。已将 Playwright 加入 `devDependencies`，使现有 QA 脚本可以在安装依赖后复现。

## 离线评测复核

运行 `pnpm eval:compile`，成功从已有预测结果重新生成 100 条样本、Prompt V1–V3 的汇总指标。

| Metric | V1 | V2 | V3 |
|---|---:|---:|---:|
| Category Accuracy | 66% | 66% | 70% |
| Intent Accuracy | 13% | 84% | 85% |
| Sentiment Accuracy | 82% | 93% | 95% |
| Severity Accuracy | 73% | 73% | 75% |
| Schema Failure Rate | 0% | 0% | 0% |

V3 仍是当前最佳综合版本。Confidence 仍未校准：V3 的 0.8–0.89 区间仅有 7 条样本，Category Accuracy 为 14.29%，因此不能把 Confidence 解释为真实正确概率。

## 新增评测维度状态

| 维度 | 当前状态 | 证据 |
|---|---|---|
| Schema Validity | 已自动验证 | 3 个版本 Schema Failure Rate 均为 0% |
| Priority Consistency | 已自动验证 | 单元测试覆盖公式、边界和输入 clamp |
| Failure Recovery | 已自动验证 | 单元测试覆盖 Retry 合并且不重复成功结果 |
| Evidence ID Validity | 已自动验证 | 未知 Evidence ID 会被拒绝 |
| Evidence Precision | 待独立人工审核 | 当前无真人审核结果 |
| Evidence Coverage | 待独立人工审核 | 当前无真人审核结果 |
| User Need Quality | 仅有 AI_PROXY | 不能表述为 Human Evaluation |
| Requirement Quality | 待人工审核 | 尚无独立评分 |

## Bad Case 状态

已从 `error_cases_v3.csv` 归档 7 条可复核案例，覆盖：

- Pricing / Content / UX / Customer Service 分类边界
- Suggestion / Request 意图边界
- Severity 高估与低估

本轮未重新调用模型，因此只记录根因假设和修复方向，不声称指标已经提升。

## 当前结论

InsightFlow 已形成“产品定义 → 可运行 MVP → 自动测试 → 离线评测 → Bad Case → 公开 Demo”的证据链。当前仍未开展真人用户测试，不能证明用户采纳率、满意度、真实效率提升或商业效果。
