const mapLabel = (value: string, labels: Record<string, string>) =>
  labels[value.toLowerCase()] ?? value;

export const sentimentLabel = (value: string) =>
  mapLabel(value, {
    positive: "正面",
    neutral: "中性",
    negative: "负面",
    mixed: "混合",
  });

export const severityLabel = (value: string) =>
  mapLabel(value, {
    critical: "致命",
    high: "高",
    medium: "中",
    low: "低",
  });

export const intentLabel = (value: string) =>
  mapLabel(value, {
    complaint: "投诉",
    request: "功能请求",
    report: "问题报告",
    inquiry: "咨询",
    praise: "表扬",
  });

export const statusLabel = (value: string) =>
  mapLabel(value, {
    analyzed: "已分析",
    processing: "处理中",
    draft: "草稿",
    failed: "失败",
    pending: "待处理",
    complete: "已完成",
    completed: "已完成",
    partial_failure: "部分失败",
  });

export const modeLabel = (value: string) =>
  mapLabel(value, {
    demo: "演示模式",
    "demo mode": "演示模式",
    live: "实时 AI",
    "live ai": "实时 AI",
  });

export const categoryLabel = (value: string) =>
  mapLabel(value, {
    ux: "用户体验",
    performance: "性能",
    reliability: "可靠性",
    pricing: "价格",
    feature: "功能",
    usability: "易用性",
    support: "客户支持",
    other: "其他",
  });

export const featureLabel = (value: string) =>
  mapLabel(value, {
    search: "搜索",
    "app stability": "应用稳定性",
    plans: "套餐",
    export: "数据导出",
    login: "登录",
  });

export const sourceLabel = (value: string) =>
  mapLabel(value, {
    "app store": "应用商店",
    survey: "用户调研",
    community: "用户社区",
    "customer service": "客户服务",
    "social media": "社交媒体",
  });

export const rangeLabel = (value: string) =>
  mapLabel(value, {
    "7 days": "近 7 天",
    "30 days": "近 30 天",
    "90 days": "近 90 天",
  });

export const prdSectionLabel = (value: string) =>
  ({
    background: "背景",
    problemStatement: "问题陈述",
    userEvidence: "用户证据",
    userNeed: "用户需求",
    productGoal: "产品目标",
    successMetrics: "成功指标",
    userStories: "用户故事",
    functionalRequirements: "功能需求",
    edgeCases: "边界情况",
    analytics: "数据分析",
    acceptanceCriteria: "验收标准",
  })[value] ?? value;
