# InsightFlow Chinese UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 InsightFlow 全部用户可见交互内容改为简体中文，同时保留真实上传反馈原文与现有数据/API 契约。

**Architecture:** 新建集中式 UI 中文映射模块，让底层英文枚举继续服务 API、Schema 与存储，所有组件在展示层调用映射。Mock 数据中的产品分析结果改为中文，但 `Feedback.content` 作为 Evidence 原文保留。现有路由、算法与交互行为不变。

**Tech Stack:** Next.js 16、React 19、TypeScript、Tailwind CSS、Recharts、React Hook Form、Zod、Node Test Runner、CloudBase Run

---

### Task 1: 建立展示层中文映射

**Files:**
- Create: `03_InsightFlow/05_App/src/lib/ui-copy.ts`
- Create: `03_InsightFlow/05_App/src/lib/ui-copy.test.ts`

- [ ] **Step 1: 写失败测试**

测试 `sentimentLabel("negative") === "负面"`、`severityLabel("critical") === "致命"`、`statusLabel("processing") === "处理中"`、`modeLabel("demo") === "演示模式"`，并验证未知动态分类值原样返回。

- [ ] **Step 2: 验证测试失败**

Run: `pnpm.cmd test`
Expected: FAIL，提示无法找到 `ui-copy.ts`。

- [ ] **Step 3: 实现映射函数**

导出 `sentimentLabel`、`severityLabel`、`intentLabel`、`statusLabel`、`modeLabel`、`categoryLabel`、`featureLabel` 和 `prdSectionLabel`。函数只改变展示文本，不改变传入值。

- [ ] **Step 4: 验证测试通过并提交**

Run: `pnpm.cmd test`
Expected: 所有测试通过。

Commit: `feat: add Chinese UI copy mappings`

### Task 2: 中文化全局框架与静态产品页面

**Files:**
- Modify: `03_InsightFlow/05_App/src/components/app-shell.tsx`
- Modify: `03_InsightFlow/05_App/src/components/product-app.tsx`
- Modify: `03_InsightFlow/05_App/src/app/layout.tsx`

- [ ] **Step 1: 中文化 App Shell**

将导航组、菜单、用户职位、顶部状态、更新时间与工作区标签改为中文；保留 `InsightFlow`、`NovaNote`、AI 与 PRD。

- [ ] **Step 2: 中文化核心流程**

覆盖仪表盘、项目、新建项目、上传、字段映射、处理中、分析标签页、反馈详情、痛点、Evidence、需求详情、产品机会、PRD、状态页以及全部按钮、表单验证、Toast、错误、空状态和加载文本。

- [ ] **Step 3: 修正元数据与语言属性**

将 `<html lang="en">` 改为 `<html lang="zh-CN">`，页面描述改为中文。

- [ ] **Step 4: 验证并提交**

Run: `pnpm.cmd typecheck && pnpm.cmd lint`
Expected: 0 errors。

Commit: `feat: localize InsightFlow interface in Chinese`

### Task 3: 中文化 Live AI 页面并保持底层契约

**Files:**
- Modify: `03_InsightFlow/05_App/src/components/live-pages.tsx`
- Use: `03_InsightFlow/05_App/src/lib/ui-copy.ts`

- [ ] **Step 1: 中文化实时分析页面**

覆盖重试错误、表格、Drawer、分析标签、痛点详情、Evidence、需求详情、机会与 PRD 的全部用户可见文本。

- [ ] **Step 2: 接入枚举展示映射**

Sentiment、Severity、Intent、Category、Feature、状态和模式渲染中文；底层 `negative`、`critical` 等值保持不变。

- [ ] **Step 3: 保证 Evidence 原文**

继续直接渲染 `originalText || content`，不对用户上传内容做翻译或覆盖。

- [ ] **Step 4: 验证并提交**

Run: `pnpm.cmd test && pnpm.cmd typecheck && pnpm.cmd lint`
Expected: 全部通过。

Commit: `feat: localize live AI analysis views`

### Task 4: 中文化统一 Mock 数据与 PRD 草稿

**Files:**
- Modify: `03_InsightFlow/05_App/src/lib/mock-data.ts`

- [ ] **Step 1: 中文化业务演示数据**

将项目名称、分析目标、来源展示值、痛点、子主题、用户需求、机会、需求标题与洞察改为中文。

- [ ] **Step 2: 保留 Evidence 原文**

保留七条 `Feedback.content` 英文原文；仅将 AI 生成的 `summary`、Category/Feature 展示数据改为中文或通过映射展示。

- [ ] **Step 3: 中文化 PRD**

将默认 PRD 的标题和 11 个章节内容改成中文，章节内部字段键保持 `PrdSections` 类型不变。

- [ ] **Step 4: 验证并提交**

Run: `pnpm.cmd test && pnpm.cmd typecheck`
Expected: 全部通过。

Commit: `feat: localize InsightFlow demo content`

### Task 5: 英文残留与浏览器 QA

**Files:**
- Modify when findings require: `03_InsightFlow/05_App/src/components/*.tsx`
- Modify when findings require: `03_InsightFlow/05_App/src/lib/mock-data.ts`
- Modify: `03_InsightFlow/06_Demo/screenshots/*.png`

- [ ] **Step 1: 扫描英文残留**

Run: `rg -n 'Dashboard|Projects|Requirements|Feedback|Pain Point|Generate|Upload|Error|Failed|Loading|Confidence|Severity|Priority|Evidence|Updated|Complete|Pending' src/components src/lib/mock-data.ts`

逐项确认只保留品牌、缩写、技术标识、代码键或真实 Evidence 原文。

- [ ] **Step 2: 启动产品并走查**

Run: `pnpm.cmd dev`

在 1440px 检查 `/dashboard`、`/projects`、`/projects/new`、`/projects/new/upload`、`/projects/new/mapping`、`/processing`、`/projects/nova-v32/analysis`、`/requirements`、`/requirements/search-optimization`、`/prd/search-optimization`、`/states`，确认无文字溢出和英文交互文案。

- [ ] **Step 3: 更新截图**

Run: `powershell -ExecutionPolicy Bypass -File scripts/capture-screenshots.ps1`
Expected: `06_Demo/screenshots` 生成 10 张中文界面截图。

- [ ] **Step 4: 提交 QA 修复**

Commit: `fix: complete Chinese UI coverage`

### Task 6: 最终验证、部署与线上检查

**Files:**
- Modify: `03_InsightFlow/05_App/DAY7_REPORT.md`
- Modify: `README.md`

- [ ] **Step 1: 运行完整验证**

Run: `pnpm.cmd test; pnpm.cmd typecheck; pnpm.cmd lint; pnpm.cmd build; pnpm.cmd audit:release`
Expected: 测试、类型检查、Lint、Build 全通过，secret/private-path findings 均为 0。

- [ ] **Step 2: 更新发布说明**

在报告中记录中文界面范围、Evidence 原文策略和真实 QA 结果。

- [ ] **Step 3: 通过干净 Git archive 重新部署 CloudBase**

部署服务 `insightflow`，禁止将 `.env.local`、`.next` 或本地缓存加入上传包。

- [ ] **Step 4: 验证线上**

确认 `/api/health`、`/dashboard`、`/requirements`、`/prd/search-optimization` 和 `/states` 返回 200，并检查关键页面中文内容。

- [ ] **Step 5: 提交并推送**

Commit: `docs: record Chinese interface release`

Push 当前分支及 `main`，确认远端 SHA 与本地一致。
