# InsightFlow 全中文交互界面设计

## 目标

将 InsightFlow 所有面向用户的产品界面统一为简体中文，消除导航、页面、表格、按钮、状态、提示、Demo 数据与 PRD 草稿中的非必要英文，同时保持现有企业级 B2B SaaS 视觉体系和完整交互闭环。

## 范围

中文化以下用户可见内容：

- 全局导航、顶部栏、面包屑与用户区域
- Dashboard、Projects、Create Project、Upload、Mapping、Processing、Analysis、Feedback、Pain Point、Evidence、Requirements、Opportunity、PRD 与 States 页面
- 页面标题、说明、标签页、指标卡、图表、表头、按钮、表单与帮助文本
- 加载、空状态、成功、部分失败、错误、重试、低置信度与证据不足状态
- Demo 项目、痛点、需求、洞察、结构化 AI 输出及默认 PRD 草稿
- 客户端产生的校验消息、Toast、复制和导出反馈

## 保留内容

- 品牌名 `InsightFlow`、产品名 `NovaNote`
- AI、PRD、CSV、XLSX、API、P0–P3 等通用产品或技术标识
- 模型及提供商标识，如 `Qwen/Qwen3.5-4B`
- 用户实际上传的原始反馈文本。Evidence 必须保持原文，确保可追溯性和证据真实性
- 内部 TypeScript 字段名、路由、API Payload、Schema 与持久化枚举值

## 翻译架构

采用 UI 展示层中文映射，不修改底层领域枚举。例如 `negative`、`critical`、`processing` 继续作为 API 和状态值，组件渲染时分别显示“负面”“严重”“处理中”。这样不会破坏 Day 5/6 的 AI Pipeline、Schema Validation、测试数据与已有 Session Storage。

共享映射集中定义，覆盖：

- sentiment：正面、中性、负面、混合
- severity：致命、高、中、低
- intent：投诉、功能请求、咨询、表扬等
- project/processing status：已分析、处理中、草稿、失败、待处理、已完成
- mode：演示模式、实时 AI
- 通用状态与评分维度

## 内容规则

- AI 生成或 Mock 的摘要、痛点、用户需求、产品机会及 PRD 默认以中文显示
- 真实上传 Evidence 保留原文；来源、日期、评分等周边标签使用中文
- 中英文混合仅用于必要缩写和专有名词，不保留完整英文说明句
- 错误信息必须包含中文原因及可执行下一步
- “AI 提供建议，PM 做最终决策”和“证据优先”原则使用自然、简洁的中文表达

## 视觉与交互

保留现有 1440px 桌面端布局、颜色、间距、圆角和组件层级。中文化不重新设计产品。针对中文文字宽度调整表格列、按钮间距与换行策略，确保：

- 侧栏项目不截断
- 表头与指标标签可读
- 状态徽标保持单行
- 长 Evidence 和 PRD 内容允许自然换行
- 表单错误与 Toast 不溢出容器

## 路由与数据流

现有路由和业务数据关系保持不变：

`Dashboard → 新建分析 → 创建项目 → 上传数据 → 字段映射 → AI 分析 → 分析结果 → 痛点 → Evidence → 需求 → 优先级 → 产品机会 → PRD`

中文化不得改变 Priority 算法、Evidence ID 关联、Business Value Slider、Manual Override 或 API 调用行为。

## 验证

1. 扫描所有 TS/TSX 中的用户可见英文，建立允许保留清单。
2. 检查导航、核心页面、状态页、Drawer、表单和 Toast。
3. 验证真实上传反馈不会被翻译或覆盖。
4. 运行单元测试、TypeScript、ESLint 和生产构建。
5. 用浏览器走通核心流程并检查中文溢出。
6. 更新截图、部署 CloudBase，并验证线上关键路由。

## 非目标

- 不增加中英文切换或完整 i18n 框架
- 不修改 Figma 视觉体系
- 不修改底层 AI Schema、算法和接口字段
- 不增加 PRD 之外的大型功能
