"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Clipboard, Download, RefreshCw } from "lucide-react";
import { AppShell, Badge, Metric, PageHeader } from "./app-shell";
import {
  feedback as demoFeedback,
  painPoints as demoPain,
  requirements as demoRequirements,
  prdDraft,
} from "@/lib/mock-data";
import { calculatePriorityScore, getPriorityFromScore } from "@/lib/priority";
import {
  mergeAnalysisResults,
  percentConfidence,
  readLiveAnalysis,
  type LiveAnalysis,
} from "@/lib/live-data";
import type { Priority } from "@/lib/types";
import {
  categoryLabel,
  featureLabel,
  intentLabel,
  prdSectionLabel,
  sentimentLabel,
  severityLabel,
  sourceLabel,
} from "@/lib/ui-copy";
const Page = ({ children }: { children: React.ReactNode }) => (
  <AppShell>{children}</AppShell>
);
const Btn = ({
  children,
  onClick,
  href,
  primary = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  primary?: boolean;
  disabled?: boolean;
}) =>
  href ? (
    <Link className={`btn ${primary ? "primary" : ""}`} href={href}>
      {children}
    </Link>
  ) : (
    <button
      className={`btn ${primary ? "primary" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
const tone = (p: string) =>
  p === "P0" ? "danger" : p === "P1" ? "warning" : "info";
function useAnalysis() {
  const [analysis, setAnalysis] = useState<LiveAnalysis | null>(null);
  useEffect(() => setAnalysis(readLiveAnalysis()), []);
  return analysis;
}
function RetryFailed({ analysis }: { analysis: LiveAnalysis }) {
  const [loading, setLoading] = useState(false),
    [error, setError] = useState("");
  async function retry() {
    setLoading(true);
    setError("");
    try {
      const upload = JSON.parse(
          sessionStorage.getItem("insightflow-upload") || "null",
        ),
        mapping = JSON.parse(
          sessionStorage.getItem("insightflow-mapping") || "null",
        ),
        project = JSON.parse(
          sessionStorage.getItem("insightflow-project") || "null",
        );
      if (!upload || !mapping)
        throw new Error("原始上传文件和字段映射已不可用。");
      const failed = new Set(analysis.failures.map((x) => x.feedbackId)),
        rows = upload.rows
          .map((r: any, i: number) => ({
            id: String(r.id || `FB_${i + 1}`),
            content: String(r[mapping.feedback] || ""),
            rating: mapping.rating
              ? Number(r[mapping.rating]) || undefined
              : undefined,
            date: mapping.date ? String(r[mapping.date] || "") : undefined,
            source: mapping.source
              ? String(r[mapping.source] || "")
              : undefined,
          }))
          .filter((x: any) => failed.has(x.id));
      const response = await fetch("/api/analysis/retry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            context: {
              productName: project?.productName || "未知产品",
              productType: project?.productType || "其他",
              analysisGoal: project?.analysisGoal || "分析用户反馈",
              language: project?.language || "自动识别",
            },
            feedback: rows,
          }),
        }),
        result = await response.json();
      if (!response.ok) throw new Error("重试失败，请稍后再试。 ");
      sessionStorage.setItem(
        "insightflow-analysis",
        JSON.stringify(mergeAnalysisResults(analysis, result)),
      );
      location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "重试失败。 ");
      setLoading(false);
    }
  }
  return (
    <span>
      <Btn onClick={retry} disabled={loading}>
        {loading ? "重试中…" : "重试失败项"}
      </Btn>
      {error && <span className="error"> {error}</span>}
    </span>
  );
}
function dataOf(live: LiveAnalysis | null) {
  return live
    ? {
        feedback: live.feedbackResults,
        pain: live.painPoints,
        requirements: live.requirements,
        mode: "实时 AI",
      }
    : {
        feedback: demoFeedback,
        pain: demoPain,
        requirements: demoRequirements,
        mode: "演示模式",
      };
}
function FeedbackTable({ items }: { items: any[] }) {
  const [selected, setSelected] = useState<any>(null);
  return (
    <>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>用户反馈</th>
              <th>分类</th>
              <th>意图</th>
              <th>情绪</th>
              <th>严重程度</th>
              <th>置信度</th>
            </tr>
          </thead>
          <tbody>
            {items.map((f) => (
              <tr
                className="clickable"
                key={f.id}
                onClick={() => setSelected(f)}
              >
                <td>{f.originalText || f.content}</td>
                <td>{categoryLabel(f.category)}</td>
                <td>{intentLabel(f.intent)}</td>
                <td>
                  <Badge tone={f.sentiment === "negative" ? "danger" : "info"}>
                    {sentimentLabel(f.sentiment)}
                  </Badge>
                </td>
                <td>{severityLabel(f.severity)}</td>
                <td>{percentConfidence(f.confidence)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <div
          className="toast"
          style={{
            right: 24,
            top: 80,
            bottom: "auto",
            width: 440,
            background: "white",
            color: "var(--ink)",
          }}
        >
          <button
            style={{ float: "right", border: 0, background: "none" }}
            onClick={() => setSelected(null)}
          >
            ×
          </button>
          <div className="eyebrow">用户原始反馈</div>
          <p className="evidence">
            “{selected.originalText || selected.content}”
          </p>
          <div className="eyebrow">AI 结构化结果</div>
          <p>
            <strong>摘要</strong>
            <br />
            {selected.summary}
          </p>
          <div className="grid two">
            <span>分类：{categoryLabel(selected.category)}</span>
            <span>意图：{intentLabel(selected.intent)}</span>
            <span>情绪：{sentimentLabel(selected.sentiment)}</span>
            <span>功能模块：{featureLabel(selected.feature)}</span>
            <span>严重程度：{severityLabel(selected.severity)}</span>
            <span>置信度：{percentConfidence(selected.confidence)}%</span>
          </div>
        </div>
      )}
    </>
  );
}
function PainTable({ items }: { items: any[] }) {
  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>用户痛点</th>
            <th>证据数量</th>
            <th>占比</th>
            <th>严重程度</th>
            <th>置信度</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td>
                <Link className="link" href={`/pain-points/${p.id}`}>
                  <strong>{p.name}</strong>
                </Link>
              </td>
              <td>{p.feedbackCount}</td>
              <td>{p.percentage}%</td>
              <td>
                <Badge tone={p.severity === "critical" ? "danger" : "warning"}>
                  {severityLabel(p.severity)}
                </Badge>
              </td>
              <td>{percentConfidence(p.confidence)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function RequirementTable({ items }: { items: any[] }) {
  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>产品需求</th>
            <th>证据数量</th>
            <th>反馈频率</th>
            <th>严重程度</th>
            <th>用户影响</th>
            <th>得分</th>
            <th>优先级</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id}>
              <td>
                <Link className="link" href={`/requirements/${r.id}`}>
                  <strong>{r.title}</strong>
                </Link>
              </td>
              <td>{r.feedbackCount}</td>
              <td>{r.frequencyScore}</td>
              <td>{r.severityScore}</td>
              <td>{r.impactScore}</td>
              <td>{r.priorityScore}</td>
              <td>
                <Badge tone={tone(r.priority)}>{r.priority}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function LiveAnalysisPage() {
  const live = useAnalysis(),
    d = dataOf(live),
    [tab, setTab] = useState("overview");
  return (
    <Page>
      <PageHeader
        title="NovaNote 用户反馈分析"
        description={`${d.feedback.length} 条反馈 · ${d.pain.length} 个用户痛点 · ${d.mode}`}
        action={<Badge tone={live ? "success" : "warning"}>{d.mode}</Badge>}
      />
      {live?.status === "partial_failure" && (
        <div className="alert warning">
          <strong>部分分析失败</strong>
          <div>
            {live.failures.length} 条反馈处理失败，已成功生成的洞察仍可使用。
          </div>
          <RetryFailed analysis={live} />
        </div>
      )}
      <div className="tabs">
        {["overview", "feedback", "pain-points", "requirements"].map((x) => (
          <button
            className={tab === x ? "active" : ""}
            onClick={() => setTab(x)}
            key={x}
          >
            {{
              overview: "概览",
              feedback: "用户反馈",
              "pain-points": "用户痛点",
              requirements: "产品需求",
            }[x] ?? x}
          </button>
        ))}
      </div>
      {tab === "overview" && (
        <>
          <div className="grid kpis">
            <Metric
              label="用户反馈"
              value={d.feedback.length}
              note="结构化分析结果"
            />
            <Metric
              label="用户痛点"
              value={d.pain.length}
              note="已关联原始证据"
            />
            <Metric
              label="产品需求"
              value={d.requirements.length}
              note="已计算优先级"
            />
            <Metric
              label="处理失败"
              value={live?.failures.length || 0}
              note="失败状态清晰可见"
            />
          </div>
          <PainTable items={d.pain} />
        </>
      )}
      {tab === "feedback" && <FeedbackTable items={d.feedback} />}{" "}
      {tab === "pain-points" && <PainTable items={d.pain} />}{" "}
      {tab === "requirements" && <RequirementTable items={d.requirements} />}
    </Page>
  );
}
export function LivePainDetail({ id }: { id: string }) {
  const live = useAnalysis(),
    d = dataOf(live),
    p = d.pain.find((x: any) => x.id === id) || d.pain[0],
    req = d.requirements.find((x: any) => x.painPointId === p?.id);
  if (!p)
    return (
      <Page>
        <div className="card">未找到该用户痛点。</div>
      </Page>
    );
  return (
    <Page>
      <PageHeader
        title={p.name}
        description={`AI 建议的用户痛点 · ${d.mode}`}
        action={
          <Badge tone={p.severity === "critical" ? "danger" : "warning"}>
            严重程度：{severityLabel(p.severity)}
          </Badge>
        }
      />
      <div className="grid kpis">
        <Metric
          label="反馈数量"
          value={p.feedbackCount}
          note="关联的支持证据"
        />
        <Metric
          label="反馈占比"
          value={`${p.percentage}%`}
          note="占已分析数据集"
        />
        <Metric
          label="负面反馈"
          value={`${p.negativeRate}%`}
          note="相关反馈中的占比"
        />
        <Metric
          label="置信度"
          value={`${percentConfidence(p.confidence)}%`}
          note="AI 自评结果"
        />
      </div>
      <div className="grid two section">
        <div className="card">
          <h2>AI 摘要</h2>
          <p>{p.description}</p>
          <h3>子主题</h3>
          <p>
            {(p.subtopics || [])
              .map((x: any) => (typeof x === "string" ? x : x.name))
              .join(" · ") || "暂无子主题"}
          </p>
        </div>
        <div className="card">
          <h2>用户需求</h2>
          <p>
            {req?.userNeed || p.userNeed || "请先审核证据，再定义用户需求。"}
          </p>
          <Btn href={`/opportunities/${req?.id || ""}`} primary>
            生成产品机会
          </Btn>
        </div>
      </div>
      <div className="card section">
        <div className="section-title">
          <h2>支持证据</h2>
          <Link className="link" href={`/evidence/${p.id}`}>
            查看全部 {p.feedbackCount} 条 →
          </Link>
        </div>
        {p.supportingFeedbackIds.slice(0, 3).map((fid: string) => {
          const f = d.feedback.find((x: any) => x.id === fid);
          return (
            f && (
              <div className="evidence" key={fid}>
                <strong>{fid}</strong>
                <p>“{f.originalText || f.content}”</p>
              </div>
            )
          );
        })}
      </div>
      {req && (
        <div className="section">
          <Btn href={`/requirements/${req.id}`} primary>
            审核产品需求
          </Btn>
        </div>
      )}
    </Page>
  );
}
export function LiveEvidence({ id }: { id: string }) {
  const live = useAnalysis(),
    d = dataOf(live),
    p = d.pain.find((x: any) => x.id === id) || d.pain[0],
    items = (p?.supportingFeedbackIds || [])
      .map((fid: string) => d.feedback.find((x: any) => x.id === fid))
      .filter(Boolean);
  return (
    <Page>
      <PageHeader
        title="支持证据"
        description={`${items.length} 条原始反馈 · ${d.mode}`}
      />
      <div className="card">
        {items.map((f: any) => (
          <div className="evidence" key={f.id}>
            <div className="section-title">
              <strong>{f.id}</strong>
              <Badge tone={f.sentiment === "negative" ? "danger" : "info"}>
                {sentimentLabel(f.sentiment)}
              </Badge>
            </div>
            <p>“{f.originalText || f.content}”</p>
            <span className="small">
              {f.source ? sourceLabel(f.source) : "上传的数据集"} ·{" "}
              {f.date || "日期不可用"}
            </span>
          </div>
        ))}
      </div>
    </Page>
  );
}
export function LiveRequirements() {
  const live = useAnalysis(),
    d = dataOf(live);
  return (
    <Page>
      <PageHeader
        title="产品需求"
        description={`AI 提供建议，最终优先级由 PM 决定 · ${d.mode}`}
      />
      <RequirementTable items={d.requirements} />
    </Page>
  );
}
export function LiveRequirementDetail({ id }: { id: string }) {
  const live = useAnalysis(),
    d = dataOf(live),
    r = d.requirements.find((x: any) => x.id === id) || d.requirements[0],
    [business, setBusiness] = useState(r?.businessValue || 50),
    [manual, setManual] = useState<Priority | null>(r?.manualPriority || null);
  if (!r)
    return (
      <Page>
        <div className="card">未找到该产品需求。</div>
      </Page>
    );
  const score = calculatePriorityScore({
      frequency: r.frequencyScore,
      severity: r.severityScore,
      impact: r.impactScore,
      businessValue: business,
      confidence: r.confidenceScore,
    }),
    ai = getPriorityFromScore(score);
  function save() {
    const analysis = readLiveAnalysis();
    if (!analysis) return;
    analysis.requirements = analysis.requirements.map((x) =>
      x.id === r.id
        ? {
            ...x,
            businessValue: business,
            priorityScore: score,
            priority: manual || ai,
            aiPriority: ai,
            manualPriority: manual,
          }
        : x,
    );
    sessionStorage.setItem("insightflow-analysis", JSON.stringify(analysis));
  }
  return (
    <Page>
      <PageHeader
        title={r.title}
        description={`优先级评审 · ${d.mode}`}
        action={
          <Btn href={`/opportunities/${r.id}`} primary>
            生成产品机会
          </Btn>
        }
      />
      {r.confidenceScore < 60 && (
        <div className="alert warning">置信度较低 · 请先审核证据再做决定。</div>
      )}
      <div className="grid two">
        <div className="card">
          <h2>优先级得分</h2>
          <div className="metric-value">{score}</div>
          {[
            ["反馈频率", r.frequencyScore],
            ["严重程度", r.severityScore],
            ["用户影响", r.impactScore],
            ["商业价值", business],
            ["置信度", r.confidenceScore],
          ].map(([n, v]) => (
            <div key={n as string}>
              <div className="section-title">
                <span>{n}</span>
                <strong>{v}</strong>
              </div>
              <div className="bar">
                <i style={{ width: `${v}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <h2>PM 决策</h2>
          <label>商业价值：{business}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={business}
            onChange={(e) => setBusiness(Number(e.target.value))}
          />
          <div className="field">
            <label>人工优先级</label>
            <select
              className="select"
              value={manual || ""}
              onChange={(e) =>
                setManual((e.target.value || null) as Priority | null)
              }
            >
              <option value="">不覆盖 AI 建议</option>
              {["P0", "P1", "P2", "P3"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
          <p>
            AI 建议：<Badge tone={tone(ai)}>{ai}</Badge>
          </p>
          <p>
            PM 最终决策：{" "}
            {manual ? (
              <Badge tone="human">{manual} · 人工覆盖</Badge>
            ) : (
              "尚未设置"
            )}
          </p>
          <Btn onClick={save} primary>
            保存决策
          </Btn>
        </div>
      </div>
    </Page>
  );
}
export function LiveOpportunity({ id }: { id: string }) {
  const live = useAnalysis(),
    d = dataOf(live),
    r = d.requirements.find((x: any) => x.id === id) || d.requirements[0],
    p = d.pain.find((x: any) => x.id === r?.painPointId),
    [value, setValue] = useState<any>(null),
    [loading, setLoading] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    const saved = sessionStorage.getItem(`insightflow-opportunity-${id}`);
    if (saved) setValue(JSON.parse(saved));
  }, [id]);
  async function generate() {
    setLoading(true);
    setError("");
    const evidence = (p?.supportingFeedbackIds || [])
      .slice(0, 8)
      .map((fid: string) => d.feedback.find((x: any) => x.id === fid))
      .filter(Boolean);
    const res = await fetch("/api/opportunity/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requirement: r,
        painPoint: p,
        evidence,
        priority: r?.manualPriority || r?.priority,
      }),
    });
    const body = await res.json();
    setLoading(false);
    if (!res.ok) return setError("产品机会生成失败，请稍后重试。 ");
    setValue(body);
    sessionStorage.setItem(
      `insightflow-opportunity-${id}`,
      JSON.stringify(body),
    );
  }
  return (
    <Page>
      <PageHeader
        title="产品机会"
        description={`${r?.title || "产品需求"} · AI 提供建议，PM 做最终决策`}
        action={
          <Btn onClick={generate} primary disabled={loading}>
            {loading ? "生成中…" : value ? "重新生成" : "生成产品机会"}
          </Btn>
        }
      />
      {error && <div className="alert danger">{error}</div>}
      {!value ? (
        <div className="card">
          <h2>可以开始探索</h2>
          <p>审核产品需求后，生成有原始证据支撑的产品方向。</p>
        </div>
      ) : (
        <div className="grid two">
          <div className="card">
            <h2>产品洞察</h2>
            <p>{value.insight}</p>
            <h2>产品机会</h2>
            <p>{value.opportunity}</p>
          </div>
          <div className="card">
            <h2>解决方案方向</h2>
            <ul>
              {value.solutionDirections.map((x: string) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <h2>潜在风险</h2>
            <ul>
              {value.risks.map((x: string) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <Btn href={`/prd/${r.id}`} primary>
              生成 PRD
            </Btn>
          </div>
        </div>
      )}
    </Page>
  );
}
export function LivePRD({ id }: { id: string }) {
  const live = useAnalysis(),
    d = dataOf(live),
    r = d.requirements.find((x: any) => x.id === id) || d.requirements[0],
    p = d.pain.find((x: any) => x.id === r?.painPointId),
    [sections, setSections] = useState<any>(prdDraft.sections),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(""),
    [generated, setGenerated] = useState(false);
  useEffect(() => {
    const saved = sessionStorage.getItem(`insightflow-prd-${id}`);
    if (saved) {
      setSections(JSON.parse(saved));
      setGenerated(true);
    }
  }, [id]);
  const markdown = useMemo(
    () =>
      `# ${r?.title || "PRD"}\n\n` +
      Object.entries(sections)
        .map(([k, v]) => `## ${prdSectionLabel(k)}\n\n${v}`)
        .join("\n\n"),
    [sections, r],
  );
  async function generate() {
    setLoading(true);
    setError("");
    const evidence = (p?.supportingFeedbackIds || [])
        .slice(0, 8)
        .map((fid: string) => d.feedback.find((x: any) => x.id === fid))
        .filter(Boolean),
      opportunity = JSON.parse(
        sessionStorage.getItem(`insightflow-opportunity-${id}`) || "null",
      );
    const res = await fetch("/api/prd/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requirement: r,
          painPoint: p,
          evidence,
          opportunity,
          priority: r?.manualPriority || r?.priority,
        }),
      }),
      body = await res.json();
    setLoading(false);
    if (!res.ok) return setError("PRD 生成失败，当前草稿已保留。");
    setSections(body);
    setGenerated(true);
    sessionStorage.setItem(`insightflow-prd-${id}`, JSON.stringify(body));
  }
  async function copy() {
    await navigator.clipboard.writeText(markdown);
  }
  function download() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([markdown], { type: "text/markdown" }),
    );
    a.download = `${r?.id || "requirement"}-prd.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  return (
    <Page>
      <PageHeader
        title={`${r?.title || "产品需求"} PRD`}
        description={`${generated ? "实时 AI 草稿" : "可编辑的初始草稿"} · 生成失败时会保留已有编辑`}
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={generate} disabled={loading}>
              <RefreshCw size={16} />
              {loading ? "生成中…" : generated ? "重新生成" : "生成"}
            </Btn>
            <Btn onClick={copy}>
              <Clipboard size={16} />
              复制
            </Btn>
            <Btn onClick={download} primary>
              <Download size={16} />
              导出
            </Btn>
          </div>
        }
      />
      {error && <div className="alert danger">{error}</div>}
      <div className="split">
        <div className="card editor">
          {Object.entries(sections).map(([key, value]) => (
            <div className="field" key={key}>
              <label>{prdSectionLabel(key)}</label>
              <textarea
                className="textarea"
                value={String(value)}
                onChange={(e) =>
                  setSections({ ...sections, [key]: e.target.value })
                }
              />
            </div>
          ))}
        </div>
        <aside className="card">
          <h2>来源信息</h2>
          <p>
            <strong>用户痛点</strong>
            <br />
            {p?.name}
          </p>
          <p>
            <strong>产品需求</strong>
            <br />
            {r?.title}
          </p>
          <p>
            <Link className="link" href={`/evidence/${p?.id}`}>
              {p?.feedbackCount || 0} 条支持证据 →
            </Link>
          </p>
          <p>
            <strong>优先级</strong> {r?.manualPriority || r?.priority}
          </p>
        </aside>
      </div>
    </Page>
  );
}
