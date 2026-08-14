# InsightFlow Day 4 Foundation Design

## 1. Objective

Day 4 的第一阶段只建立高保真前端所需的工程基础：Next.js 项目、依赖、目录结构、全局 App Shell、Design Tokens、TypeScript 领域类型、Zod 数据契约和统一 Mock Data 入口。

本阶段不开发完整业务页面，不接入真实 LLM API、数据库、认证或外部集成。

## 2. Sources of Truth

优先级如下：

1. 最终 Figma 文件是视觉事实源；
2. `PRD.md` 是功能事实源；
3. `AI_Output_Schema.md` 是前端领域对象与状态字段的事实源；
4. `Design_System.md` 是 token 和组件语义的事实源；
5. 本设计仅负责把上述约束映射为可扩展的前端基础。

当 Figma 与早期文档存在表现差异时，视觉结构服从最终 Figma，业务规则仍服从 PRD。

## 3. Confirmed Scope

### Included

- 在 `03_InsightFlow/05_App` 初始化 Next.js App Router 项目；
- TypeScript、Tailwind CSS、ESLint；
- shadcn/ui 基础配置；
- Lucide Icons、Recharts、React Hook Form、Zod；
- `pnpm` 脚本和锁文件；
- 全局 CSS variables 与 Tailwind token 映射；
- Sidebar、Topbar 和 AppShell 基础组件；
- 产品领域 TypeScript 类型；
- 对应核心领域对象的 Zod schemas；
- 统一 Mock Data 入口与演示项目常量；
- 基础首页只用于验证 Layout，不实现完整 Dashboard。

### Excluded

- 12 个完整产品页面；
- 真实文件解析和上传存储；
- 真实 AI pipeline；
- 数据库与持久化；
- 认证、权限、协作和第三方集成；
- 真实 Markdown 文件导出；
- Figma 中不存在的大型功能。

## 4. Architecture Decision

采用 feature-oriented 目录结构。App Router 负责路由与页面组合，`features` 按产品领域组织业务 UI 和未来 API adapter，`components` 只保存跨领域的基础 UI 与 App Shell，`types` 和 `schemas` 分别保存静态类型与运行时契约。

```text
03_InsightFlow/05_App/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   │   ├── app-shell.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── topbar.tsx
│   │   └── shared/
│   ├── features/
│   │   ├── projects/
│   │   ├── analysis/
│   │   ├── evidence/
│   │   ├── requirements/
│   │   └── prd/
│   ├── data/
│   │   └── mock-data.ts
│   ├── lib/
│   │   ├── constants.ts
│   │   ├── priority.ts
│   │   └── utils.ts
│   ├── schemas/
│   │   └── domain.ts
│   └── types/
│       └── domain.ts
├── components.json
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

空的 feature 目录不会通过占位文件大量扩张；仅创建本阶段确实需要的边界和 barrel 文件。

## 5. Global Layout

App Shell 跟随最终 Figma：

- 1440px desktop-first；
- Sidebar 宽 240px；
- Topbar 高 64px；
- Main content padding 32px；
- Canvas 使用 `neutral/25`；
- Surface 使用 `neutral/0`；
- Sidebar 使用 `neutral/950`；
- 卡片默认 8px radius 和 1px strong border。

Sidebar 首阶段只包含最终 Figma 已有的 Projects、Dashboard、Analysis、Requirements。Topbar 提供项目上下文、分析状态与更新时间。页面正文只放基础架构验证内容，不复制 Dashboard 完整模块。

## 6. Design Tokens

CSS variables 与 Figma Variables 一一对应，至少包括：

- Neutral：0、25、50、100、200、400、600、800、950；
- Brand：50、100、500、600、700；
- Semantic：canvas、surface、subtle、selected、primary/secondary/muted/link text、default/strong/focus border、success/warning/danger/info/human；
- Spacing：0、4、8、12、16、20、24、32、40、48px；
- Radius：4、6、8、10px；
- Control sizes：32、36、40px；
- Elevation：Figma 的两个 shadow styles。

字体使用 Figma 已确认的 Inter。Typography scale 包含 Display、H1、H2、H3、Body、Body Strong、Small、Label、Metric 和 Table。

## 7. Domain Types

类型以 `AI_Output_Schema.md` 为依据，建立以下核心对象：

- `Project`
- `AnalysisBatchSummary`
- `RawFeedback`
- `FeedbackAnalysis`
- `PainPoint` 与 `Subtopic`
- `Requirement`
- `PriorityAssessment`
- `Opportunity`
- `PrdDraft` 与 `PrdSections`
- `ReviewOverlay`
- `ProcessingError`

同时建立枚举联合类型：Sentiment、Intent、Severity、RequirementType、ConfidenceLevel、Priority、ReviewStatus、ProcessingStatus。

`PriorityAssessment` 保留 AI Recommendation 和 Manual Priority 两个独立字段。所有带 Evidence 的对象使用 ID 数组保存 lineage，不把 Evidence 文本复制到每个对象。

## 8. Runtime Schemas and Mock Data

Zod schemas 与 TypeScript 类型共享字段命名，覆盖至少 Raw Feedback、Pain Point、Requirement、Priority Assessment、Batch Summary。边界规则包括：

- Confidence 为 0–1；
- score 为 0–100；
- sentiment score 为 -1–1；
- Evidence ID 数组不能为空的对象在 schema 层校验；
- Priority 与 review 状态使用明确枚举；
- Manual Priority 允许 `null`，但不能覆盖 AI Recommendation。

Mock Data 使用同一批演示数字：1,248 valid feedback、1,239 processed、9 failed、26 insights、42% negative、Search Experience 186、App Stability 142。数据按实体导出，页面后续通过 selector 或 adapter 读取，避免散落硬编码。

## 9. Priority Utility

建立纯函数实现 PRD 中的确定性公式：

```text
frequency × 0.30
+ severity × 0.25
+ impact × 0.20
+ business value × 0.15
+ confidence × 0.10
```

函数负责限制输入范围、四舍五入总分并映射 P0–P3。它不读取 React 状态，也不让 AI 直接输出最终 Priority。

## 10. Error and State Foundations

领域类型必须能表达：

- pending、running、completed、completed_with_errors、failed；
- low confidence；
- retryable processing error；
- empty evidence；
- manual override；
- stale 字段仅作为数据契约保留，不在本阶段开发独立 Stale 页面。

本阶段不实现完整状态页面，但 Layout 与类型不能阻碍 Day 4 后续页面接入。

## 11. Testing and Verification

基础架构完成后执行：

- `pnpm lint`；
- `pnpm typecheck`；
- `pnpm build`；
- priority utility 单元测试；
- Zod mock-data validation；
- 检查页面可启动且 App Shell 无水平溢出。

## 12. Known Figma / PRD Differences

1. PRD 用 8 个主要页面概括信息架构，最终 Figma 拆成 12 个具体 Screens；这是流程拆分，不是新增大型功能。
2. 最终 Figma 将 Supporting Evidence 实现为独立页面，而非早期规格中的 Drawer。
3. 最终 Figma 没有单独命名的 Data Preview Screen，相关信息由 Upload Dataset 与 Field Mapping 承担。
4. Figma 包含完整 UI 状态表现；本基础阶段只建立它们需要的数据和样式基础，不提前实现完整页面。

## 13. Completion Boundary

当项目可以安装、lint、type-check 和 build，App Shell 与 tokens 可复用，领域类型与 Mock Data 可供后续页面消费时，本阶段完成。随后停止，不继续实现 Dashboard 或其他完整产品页面。
