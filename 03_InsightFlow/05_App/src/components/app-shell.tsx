"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FolderKanban,
  MessageSquareText,
  Search,
  Lightbulb,
  FileText,
  Settings,
} from "lucide-react";
const groups = [
  {
    label: "概览",
    items: [
      ["仪表盘", "/dashboard", BarChart3],
      ["项目", "/projects", FolderKanban],
    ],
  },
  {
    label: "用户研究",
    items: [
      [
        "用户反馈",
        "/projects/nova-v32/analysis?tab=feedback",
        MessageSquareText,
      ],
      ["用户痛点", "/projects/nova-v32/analysis?tab=pain-points", Search],
      ["产品需求", "/requirements", Lightbulb],
    ],
  },
  {
    label: "AI",
    items: [
      ["产品机会", "/pain-points/search-experience", Lightbulb],
      ["PRD 生成器", "/prd/search-optimization", FileText],
    ],
  },
];
export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">INSIGHTFLOW</div>
        {groups.map((g) => (
          <div key={g.label}>
            <div className="nav-label">{g.label}</div>
            <nav className="nav">
              {g.items.map(([label, href, Icon]) => (
                <Link
                  key={label as string}
                  href={href as string}
                  className={
                    path.startsWith((href as string).split("?")[0])
                      ? "active"
                      : ""
                  }
                >
                  <Icon size={16} />
                  {label as string}
                </Link>
              ))}
            </nav>
          </div>
        ))}
        <div className="profile">
          <strong>Bi Penglei</strong>
          <span>产品经理</span>
          <Link
            href="/states"
            style={{ display: "flex", gap: 8, marginTop: 14, fontSize: 12 }}
          >
            <Settings size={14} /> 演示状态
          </Link>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <span className="crumb">NovaNote / V3.2 用户反馈</span>
          <div className="top-meta">
            <span className="badge warning">已完成，存在部分错误</span>
            <span className="small">2 分钟前更新</span>
          </div>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-head">
      <div>
        <div className="eyebrow">NovaNote · 用户研究工作区</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function Badge({
  children,
  tone = "info",
}: {
  children: React.ReactNode;
  tone?: "info" | "success" | "warning" | "danger" | "human";
}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
export function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: string | number;
  note: string;
}) {
  return (
    <div className="card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="small">{note}</div>
    </div>
  );
}
