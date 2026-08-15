"use client";
/* eslint-disable @typescript-eslint/no-unused-expressions, @typescript-eslint/no-unused-vars, @next/next/no-location-assign-relative-destination */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowLeft,
  ChevronRight,
  Clipboard,
  Download,
  X,
  RefreshCw,
  UploadCloud,
} from "lucide-react";
import { AppShell, Badge, Metric, PageHeader } from "./app-shell";
import {
  feedback,
  insights,
  painPoints,
  prdDraft,
  projects,
  requirements,
  sentimentData,
} from "@/lib/mock-data";
import { calculatePriorityScore, getPriorityFromScore } from "@/lib/priority";
import type { Priority } from "@/lib/types";
import {
  categoryLabel,
  featureLabel,
  intentLabel,
  sentimentLabel,
  severityLabel,
  statusLabel,
  prdSectionLabel,
  rangeLabel,
  sourceLabel,
} from "@/lib/ui-copy";
import {
  LiveAnalysisPage,
  LiveEvidence,
  LiveOpportunity,
  LivePainDetail,
  LivePRD,
  LiveRequirementDetail,
  LiveRequirements,
} from "./live-pages";

const Btn = ({
  children,
  href,
  primary = false,
  disabled = false,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  href?: string;
  primary?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) =>
  href ? (
    <Link className={`btn ${primary ? "primary" : ""}`} href={href}>
      {children}
    </Link>
  ) : (
    <button
      className={`btn ${primary ? "primary" : ""}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
const priorityTone = (p: Priority) =>
  p === "P0" ? "danger" : p === "P1" ? "warning" : "info";
const Page = ({ children }: { children: React.ReactNode }) => (
  <AppShell>{children}</AppShell>
);
const Section = ({
  title,
  link,
  children,
}: {
  title: string;
  link?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className="section">
    <div className="section-title">
      <h2>{title}</h2>
      {link}
    </div>
    {children}
  </section>
);

function Dashboard() {
  const [range, setRange] = useState<keyof typeof sentimentData>("30 days");
  const [selectedPain, setSelectedPain] = useState<(typeof painPoints)[number] | null>(null);
  const evidence = selectedPain
    ? selectedPain.supportingFeedbackIds.map((id) => feedback.find((item) => item.id === id)).filter(Boolean).slice(0, 4)
    : [];
  return (
    <Page>
      <PageHeader
        title="仪表盘"
        description="早上好，Bi。以下是用户反馈中的最新发现。"
        action={
          <Btn href="/projects/new" primary>
            新建分析
          </Btn>
        }
      />
      <div className="grid kpis">
        <Metric label="反馈总数" value="1,248" note="当前批次的有效反馈" />
        <Metric label="负面反馈" value="42%" note="占已分析反馈的比例" />
        <Metric label="AI 洞察" value="26" note="全部关联原始证据" />
        <Metric label="高优先级需求" value="5" note="AI 建议 · 需 PM 审核" />
      </div>
      <div className="grid two section">
        <div className="card">
          <Section title="主要用户痛点">
            <div style={{ height: 250 }}>
              <ResponsiveContainer>
                <BarChart
                  data={painPoints}
                  layout="vertical"
                  margin={{ left: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" unit="%" />
                  <YAxis dataKey="name" type="category" width={110} />
                  <Tooltip />
                  <Bar isAnimationActive={false} dataKey="percentage" fill="#2878d4" radius={[0, 4, 4, 0]} onClick={(entry) => setSelectedPain(painPoints.find((item) => item.name === (entry as { name?: string }).name) || null)} cursor="pointer" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>
        <div className="card">
          <div className="section-title">
            <h2>情绪趋势</h2>
            <select
              className="select"
              style={{ width: 110 }}
              value={range}
              onChange={(e) =>
                setRange(e.target.value as keyof typeof sentimentData)
              }
            >
              {Object.keys(sentimentData).map((x) => (
                <option key={x} value={x}>
                  {rangeLabel(x)}
                </option>
              ))}
            </select>
          </div>
          <div style={{ height: 270 }}>
            <ResponsiveContainer>
              <AreaChart data={sentimentData[range]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="d" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  isAnimationActive={false}
                  dataKey="p"
                  name="正面"
                  stroke="#1f8a70"
                  fill="#ecf8f1"
                />
                <Area
                  isAnimationActive={false}
                  dataKey="u"
                  name="中性"
                  stroke="#8a96a6"
                  fill="#e9edf2"
                />
                <Area
                  isAnimationActive={false}
                  dataKey="n"
                  name="负面"
                  stroke="#c23b45"
                  fill="#fff0f0"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <RequirementsTable compact />
      <Section
        title="近期 AI 洞察"
        link={
          <Link className="link" href="/projects/nova-v32/analysis">
            查看全部 26 条 →
          </Link>
        }
      >
        <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
          {insights.map((i) => (
            <Link
              href={`/pain-points/${i.painPointId}`}
              className="card"
              key={i.id}
            >
              <h3 style={{ marginTop: 0 }}>{i.title}</h3>
              <p className="small">{i.detail}</p>
              <div className="link">{i.evidenceCount} 条支持证据 →</div>
              <p className="small">AI 建议 · 置信度 {i.confidence}%</p>
            </Link>
          ))}
        </div>
      </Section>
      {selectedPain && (
        <div className="drawer-backdrop" onClick={() => setSelectedPain(null)}>
          <aside className="evidence-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="section-title">
              <div>
                <div className="eyebrow">证据驾驶舱</div>
                <h2 style={{ margin: "4px 0" }}>{selectedPain.name}</h2>
                <p className="small">{selectedPain.feedbackCount} 条关联反馈 · 置信度 {selectedPain.confidence}%</p>
              </div>
              <button className="drawer-close" onClick={() => setSelectedPain(null)} aria-label="关闭证据面板"><X size={18} /></button>
            </div>
            <div className="alert info">AI 洞察只在有可追溯原始证据时展示。</div>
            <div className="drawer-summary"><strong>AI 摘要</strong><p>{selectedPain.description}</p></div>
            <div className="section-title"><h3 style={{ margin: 0 }}>支持证据</h3><span className="small">显示前 4 条</span></div>
            <div className="drawer-evidence-list">
              {evidence.map((item) => item && <div className="evidence" key={item.id}><div className="section-title"><strong>{item.id}</strong><span className="small">{sourceLabel(item.source)} · {item.date}</span></div><p>“{item.content}”</p><span className="small">评分 {item.rating} 星</span></div>)}
            </div>
            <div className="drawer-actions"><Link className="btn" href={`/evidence/${selectedPain.id}`}>查看全部证据</Link><Link className="btn primary" href={`/requirements/${requirements.find((item) => item.painPointId === selectedPain.id)?.id || "search-optimization"}`}>创建产品需求</Link></div>
          </aside>
        </div>
      )}
    </Page>
  );
}

function Projects() {
  const empty = useSearchParams().get("empty") === "1";
  return (
    <Page>
      <PageHeader
        title="用户研究项目"
        description="按产品、版本或研究目标管理反馈分析。"
        action={
          <Btn href="/projects/new" primary>
            新建项目
          </Btn>
        }
      />
      {empty ? (
        <State
          title="还没有用户研究项目"
          text="创建研究项目，统一管理用户反馈与 AI 洞察。"
          action={
            <Btn href="/projects/new" primary>
              新建项目
            </Btn>
          }
        />
      ) : (
        <div className="grid two">
          {projects.map((p) => (
            <Link
              className="card"
              href={
                p.status === "analyzed"
                  ? `/projects/${p.id}/analysis`
                  : p.status === "processing"
                    ? "/processing"
                    : "/projects/new"
              }
              key={p.id}
            >
              <div className="section-title">
                <h2>{p.name}</h2>
                <Badge
                  tone={
                    p.status === "analyzed"
                      ? "success"
                      : p.status === "processing"
                        ? "info"
                        : p.status === "failed"
                          ? "danger"
                          : "warning"
                  }
                >
                  {statusLabel(p.status)}
                </Badge>
              </div>
              <p className="small">
                {p.productName} · {p.productType}
              </p>
              <div style={{ display: "flex", gap: 24, marginTop: 24 }}>
                <strong>{p.feedbackCount.toLocaleString()} 条反馈</strong>
                <strong>{p.insightCount} 条洞察</strong>
              </div>
              <p className="small">更新于 {p.updatedAt}</p>
            </Link>
          ))}
        </div>
      )}
    </Page>
  );
}

const projectSchema = z.object({
  projectName: z.string().trim().min(1, "请输入项目名称"),
  productName: z.string().trim().min(1, "请输入产品名称"),
  productType: z.string(),
  analysisGoal: z.string().trim().min(1, "请输入分析目标"),
  dataSource: z.string(),
  language: z.string(),
});
type ProjectForm = z.infer<typeof projectSchema>;
function CreateProject() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: "NovaNote V3.2 用户反馈",
      productName: "NovaNote",
      productType: "SaaS",
      analysisGoal: "了解版本发布后的用户阻碍，并确定下一次迭代重点",
      dataSource: "应用商店",
      language: "自动识别",
    },
  });
  const submit = (v: ProjectForm) => {
    sessionStorage.setItem("insightflow-project", JSON.stringify(v));
    router.push("/projects/new/upload");
  };
  return (
    <Page>
      <PageHeader
        title="创建项目"
        description="上传反馈前，请先定义本次用户研究的背景。"
      />
      <form className="card form" onSubmit={handleSubmit(submit)}>
        {[
          ["项目名称 *", "projectName"],
          ["产品名称 *", "productName"],
        ].map(([l, n]) => (
          <div className="field" key={n}>
            <label>{l}</label>
            <input
              className="input"
              {...register(n as "projectName" | "productName")}
            />
            <span className="error">
              {errors[n as "projectName" | "productName"]?.message}
            </span>
          </div>
        ))}
        <div className="grid two">
          <FieldSelect
            label="产品类型"
            reg={register("productType")}
            options={[
              "SaaS",
              "移动应用",
              "电商",
              "AI 产品",
              "内容产品",
              "其他",
            ]}
          />
          <FieldSelect
            label="数据来源"
            reg={register("dataSource")}
            options={[
              "应用商店",
              "用户调研",
              "客户服务",
              "社交媒体",
              "用户社区",
              "其他",
            ]}
          />
        </div>
        <div className="field">
          <label>分析目标 *</label>
          <textarea className="textarea" {...register("analysisGoal")} />
          <span className="error">{errors.analysisGoal?.message}</span>
        </div>
        <FieldSelect
          label="语言"
          reg={register("language")}
          options={["自动识别", "英文", "中文"]}
        />
        <div style={{ display: "flex", gap: 12 }}>
          <Btn href="/projects">取消</Btn>
          <Btn primary type="submit" disabled={isSubmitting}>
            {isSubmitting ? "创建中…" : "继续"}
          </Btn>
        </div>
      </form>
    </Page>
  );
}
function FieldSelect({
  label,
  reg,
  options,
}: {
  label: string;
  reg: object;
  options: string[];
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <select className="select" {...reg}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

type UploadState = {
  name: string;
  size: number;
  headers: string[];
  rows: Record<string, unknown>[];
};
function UploadPage() {
  const router = useRouter();
  const [drag, setDrag] = useState(false),
    [file, setFile] = useState<UploadState | null>(null),
    [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  async function parse(f: File) {
    setError("");
    if (!/\.(csv|xlsx)$/i.test(f.name))
      return setError("不支持该文件格式，请上传 CSV 或 XLSX 文件。 ");
    if (f.size > 10 * 1024 * 1024)
      return setError("文件超过 MVP 的 10MB 大小限制。 ");
    try {
      let rows: Record<string, unknown>[] = [];
      if (f.name.endsWith(".csv")) {
        const result = Papa.parse<Record<string, unknown>>(await f.text(), {
          header: true,
          skipEmptyLines: true,
        });
        rows = result.data;
      } else {
        const wb = XLSX.read(await f.arrayBuffer());
        rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      }
      if (!rows.length)
        return setError("数据集为空，请上传至少包含一条用户反馈的文件。");
      if (rows.length > 5000)
        return setError("数据集超过 MVP 的 5,000 行限制。 ");
      const value = {
        name: f.name,
        size: f.size,
        headers: Object.keys(rows[0]),
        rows,
      };
      setFile(value);
      sessionStorage.setItem("insightflow-upload", JSON.stringify(value));
    } catch {
      setError("无法读取该文件，请尝试其他 CSV 或 XLSX 文件。 ");
    }
  }
  return (
    <Page>
      <PageHeader
        title="上传数据集"
        description="上传一个 CSV 或 XLSX 文件，最大 10MB、5,000 行。"
      />
      <input
        ref={input}
        hidden
        type="file"
        accept=".csv,.xlsx"
        onChange={(e) => e.target.files?.[0] && parse(e.target.files[0])}
      />
      {error && (
        <div className="alert danger">
          <strong>上传失败</strong>
          <div>{error}</div>
        </div>
      )}
      <div
        className={`drop ${drag ? "drag" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          e.dataTransfer.files[0] && parse(e.dataTransfer.files[0]);
        }}
      >
        <UploadCloud size={36} color="#2878d4" />
        <h2>将 CSV 或 XLSX 文件拖放到这里</h2>
        <p className="small">也可以从电脑中选择文件</p>
        <Btn onClick={() => input.current?.click()} primary>
          选择文件
        </Btn>
      </div>
      {file && (
        <div className="card section">
          <div className="section-title">
            <div>
              <strong>{file.name}</strong>
              <p className="small">
                {(file.size / 1024 / 1024).toFixed(2)} MB · 检测到{" "}
                {file.rows.length.toLocaleString()} 行数据
              </p>
            </div>
            <Badge tone="success">校验通过</Badge>
          </div>
          <Preview rows={file.rows.slice(0, 3)} headers={file.headers} />
          <Btn primary onClick={() => router.push("/projects/new/mapping")}>
            继续字段映射 <ChevronRight size={16} />
          </Btn>
        </div>
      )}
    </Page>
  );
}
function Preview({
  rows,
  headers,
}: {
  rows: Record<string, unknown>[];
  headers: string[];
}) {
  return (
    <div style={{ overflow: "auto", margin: "16px 0" }}>
      <table>
        <thead>
          <tr>
            {headers.slice(0, 5).map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {headers.slice(0, 5).map((h) => (
                <td key={h}>{String(r[h] ?? "").slice(0, 72)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Mapping() {
  const router = useRouter();
  const stored =
    typeof window !== "undefined"
      ? sessionStorage.getItem("insightflow-upload")
      : null;
  const data: UploadState = stored
    ? JSON.parse(stored)
    : {
        name: "demo_feedback.csv",
        size: 1800000,
        headers: ["content", "rating", "date", "source"],
        rows: feedback.map((f) => ({
          content: f.content,
          rating: f.rating,
          date: f.date,
          source: f.source,
        })),
      };
  const [mapping, setMapping] = useState({
    feedback:
      data.headers.find((h) => /content|feedback|review/i.test(h)) || "",
    rating: data.headers.find((h) => /rating|star/i.test(h)) || "",
    date: data.headers.find((h) => /date|created/i.test(h)) || "",
    source: data.headers.find((h) => /source|channel/i.test(h)) || "",
  });
  return (
    <Page>
      <PageHeader
        title="字段映射"
        description={`${data.name} 中检测到 ${data.rows.length.toLocaleString()} 行数据`}
      />
      {!mapping.feedback && (
        <div className="alert danger">请选择包含用户反馈的字段。</div>
      )}
      <div className="card">
        <div className="grid two">
          {(
            [
              ["反馈内容 *", "feedback"],
              ["评分", "rating"],
              ["日期", "date"],
              ["来源", "source"],
            ] as const
          ).map(([label, key]) => (
            <div className="field" key={key}>
              <label>{label}</label>
              <select
                className="select"
                value={mapping[key]}
                onChange={(e) =>
                  setMapping({ ...mapping, [key]: e.target.value })
                }
              >
                <option value="">不映射</option>
                {data.headers.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <Section title="映射预览">
          <Preview
            headers={["反馈内容", "评分", "日期", "来源"]}
            rows={data.rows.slice(0, 5).map((r) => ({
              反馈内容: r[mapping.feedback] ?? "—",
              评分: r[mapping.rating] ?? "—",
              日期: r[mapping.date] ?? "—",
              来源: r[mapping.source] ?? "—",
            }))}
          />
        </Section>
        <Btn
          primary
          disabled={!mapping.feedback}
          onClick={() => {
            sessionStorage.setItem(
              "insightflow-mapping",
              JSON.stringify(mapping),
            );
            router.push("/processing");
          }}
        >
          开始 AI 分析
        </Btn>
      </div>
    </Page>
  );
}

function Processing() {
  const [state, setState] = useState({
    stage: "validating",
    processed: 0,
    success: 0,
    failed: 0,
    total: 0,
    done: false,
    mode: "checking",
    error: "",
  });
  const stages = ["数据校验", "反馈分析", "痛点归纳", "需求提取", "优先级计算"];
  useEffect(() => {
    let active = true;
    async function run() {
      const upload = JSON.parse(
        sessionStorage.getItem("insightflow-upload") || "null",
      ) as UploadState | null;
      const mapping = JSON.parse(
        sessionStorage.getItem("insightflow-mapping") || "null",
      ) as {
        feedback: string;
        rating: string;
        date: string;
        source: string;
      } | null;
      const project = JSON.parse(
        sessionStorage.getItem("insightflow-project") || "null",
      ) as ProjectForm | null;
      const status = await fetch("/api/ai/status").then((r) => r.json());
      if (!active) return;
      if (status.mode !== "live" || !upload || !mapping) {
        setState({
          stage: "complete",
          processed: upload?.rows.length || 1248,
          success: upload?.rows.length || 1239,
          failed: upload ? 0 : 9,
          total: upload?.rows.length || 1248,
          done: true,
          mode: "demo",
          error: "",
        });
        return;
      }
      const rows = upload.rows
        .map((r, i) => ({
          id: String(r.id || `FB_${i + 1}`),
          content: String(r[mapping.feedback] || ""),
          rating: mapping.rating
            ? Number(r[mapping.rating]) || undefined
            : undefined,
          date: mapping.date ? String(r[mapping.date] || "") : undefined,
          source: mapping.source ? String(r[mapping.source] || "") : undefined,
        }))
        .filter((x) => x.content);
      setState((s) => ({
        ...s,
        total: rows.length,
        mode: "live",
        stage: "processing_feedback",
      }));
      const response = await fetch("/api/analysis/run", {
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
      });
      const result = await response.json();
      if (!active) return;
      if (!response.ok) {
        setState((s) => ({
          ...s,
          done: true,
          error: "AI 分析失败，请稍后重试。",
        }));
        return;
      }
      sessionStorage.setItem("insightflow-analysis", JSON.stringify(result));
      setState({
        stage: result.status,
        processed: rows.length,
        success: result.telemetry.successCount,
        failed: result.telemetry.failureCount,
        total: rows.length,
        done: true,
        mode: "live",
        error: "",
      });
    }
    run().catch(
      () =>
        active &&
        setState((s) => ({
          ...s,
          done: true,
          error: "分析请求失败，请重试。",
        })),
    );
    return () => {
      active = false;
    };
  }, []);
  const stageIndex = state.done
    ? stages.length
    : Math.max(
        0,
        [
          "validating",
          "processing_feedback",
          "consolidating_pain_points",
          "extracting_requirements",
          "calculating_priority",
        ].indexOf(state.stage),
      );
  return (
    <Page>
      <PageHeader
        title={
          state.done && !state.error
            ? "分析完成"
            : `正在分析 ${state.total || "当前"} 条用户反馈`
        }
        description={`先提取结构化事实，再生成洞察 · ${state.mode === "live" ? "实时 AI" : "演示模式"}`}
      />
      <div className="card" style={{ maxWidth: 820 }}>
        {state.error && (
          <div className="alert danger">
            <strong>分析失败</strong>
            <div>{state.error}</div>
          </div>
        )}
        <div className="pipeline">
          {stages.map((s, i) => (
            <div
              className={`step ${i === stageIndex ? "processing" : ""}`}
              key={s}
            >
              <strong>{s}</strong>
              <Badge
                tone={
                  i < stageIndex
                    ? "success"
                    : i === stageIndex
                      ? "info"
                      : "warning"
                }
              >
                {i < stageIndex
                  ? "已完成"
                  : i === stageIndex
                    ? "处理中"
                    : "待处理"}
              </Badge>
            </div>
          ))}
        </div>
        <div className="section">
          <div className="section-title">
            <strong>
              已处理 {state.processed} / {state.total || "—"}
            </strong>
            <span>
              成功 {state.success} · 失败 {state.failed}
            </span>
          </div>
          <div className="progress">
            <span
              style={{
                width: `${state.total ? (state.processed / state.total) * 100 : 5}%`,
              }}
            />
          </div>
        </div>
        {state.failed > 0 && (
          <div className="alert warning">
            <strong>部分反馈处理失败</strong>
            <div>
              已分析 {state.success} 条，失败 {state.failed}{" "}
              条。已生成的洞察仍可正常使用。
            </div>
          </div>
        )}
        <div style={{ display: "flex", gap: 12 }}>
          {state.error && (
            <Btn onClick={() => location.reload()}>
              <RefreshCw size={16} /> 重试
            </Btn>
          )}
          {state.done && !state.error && (
            <Btn href="/projects/nova-v32/analysis" primary>
              查看分析结果
            </Btn>
          )}
        </div>
      </div>
    </Page>
  );
}

function Analysis() {
  const query = useSearchParams();
  const [tab, setTab] = useState(query.get("tab") || "overview");
  const tabs = [
    "overview",
    "feedback",
    "pain-points",
    "sentiment",
    "requirements",
  ];
  return (
    <Page>
      <PageHeader
        title="NovaNote V3.2 用户反馈"
        description="1,248 条反馈 · 26 条洞察 · 42% 负面反馈"
      />
      <div className="tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {{
              overview: "概览",
              feedback: "用户反馈",
              "pain-points": "用户痛点",
              sentiment: "情绪分析",
              requirements: "产品需求",
            }[t] ?? t}
          </button>
        ))}
      </div>
      {tab === "overview" && (
        <>
          <div className="grid kpis">
            <Metric label="用户反馈" value="1,248" note="有效数据行" />
            <Metric label="AI 洞察" value="26" note="100% 可追溯" />
            <Metric label="负面反馈" value="42%" note="当前分析批次" />
            <Metric label="处理失败" value="9" note="可重新处理" />
          </div>
          <PainTable />
        </>
      )}
      {tab === "feedback" && <FeedbackTable />}
      {tab === "pain-points" && <PainTable />}
      {tab === "sentiment" && (
        <div className="card" style={{ height: 420 }}>
          <ResponsiveContainer>
            <AreaChart data={sentimentData["30 days"]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="d" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area dataKey="p" stroke="#1f8a70" fill="#ecf8f1" />
              <Area dataKey="n" stroke="#c23b45" fill="#fff0f0" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      {tab === "requirements" && <RequirementsTable />}
    </Page>
  );
}
function FeedbackTable() {
  const [selected, setSelected] = useState<(typeof feedback)[number] | null>(
    null,
  );
  return (
    <>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>用户反馈</th>
              <th>分类</th>
              <th>情绪</th>
              <th>功能模块</th>
              <th>严重程度</th>
              <th>置信度</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((f) => (
              <tr
                className="clickable"
                key={f.id}
                onClick={() => setSelected(f)}
              >
                <td>{f.content}</td>
                <td>{categoryLabel(f.category)}</td>
                <td>
                  <Badge tone={f.sentiment === "negative" ? "danger" : "info"}>
                    {sentimentLabel(f.sentiment)}
                  </Badge>
                </td>
                <td>{featureLabel(f.feature)}</td>
                <td>{severityLabel(f.severity)}</td>
                <td>{f.confidence}%</td>
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
            width: 420,
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
          <p className="evidence">“{selected.content}”</p>
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
            <span>置信度：{selected.confidence}%</span>
          </div>
        </div>
      )}
    </>
  );
}
function PainTable() {
  return (
    <Section title="用户痛点">
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>用户痛点</th>
              <th>反馈数量</th>
              <th>占比</th>
              <th>严重程度</th>
              <th>置信度</th>
            </tr>
          </thead>
          <tbody>
            {painPoints.map((p) => (
              <tr
                className="clickable"
                key={p.id}
                onClick={() => (location.href = `/pain-points/${p.id}`)}
              >
                <td>
                  <strong>{p.name}</strong>
                </td>
                <td>{p.feedbackCount}</td>
                <td>{p.percentage}%</td>
                <td>
                  <Badge
                    tone={p.severity === "critical" ? "danger" : "warning"}
                  >
                    {severityLabel(p.severity)}
                  </Badge>
                </td>
                <td>{p.confidence}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
function RequirementsTable({ compact = false }: { compact?: boolean }) {
  return (
    <Section
      title="需求优先级"
      link={
        <Link className="link" href="/requirements">
          查看全部需求 →
        </Link>
      }
    >
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>产品需求</th>
              <th>证据数量</th>
              {!compact && (
                <>
                  <th>频率</th>
                  <th>严重程度</th>
                  <th>用户影响</th>
                  <th>商业价值</th>
                </>
              )}
              <th>得分</th>
              <th>优先级</th>
            </tr>
          </thead>
          <tbody>
            {requirements
              .slice(0, compact ? 3 : requirements.length)
              .map((r) => (
                <tr
                  className="clickable"
                  key={r.id}
                  onClick={() => (location.href = `/requirements/${r.id}`)}
                >
                  <td>
                    <strong>{r.title}</strong>
                  </td>
                  <td>{r.feedbackCount}</td>
                  {!compact && (
                    <>
                      <td>{r.frequencyScore}</td>
                      <td>{r.severityScore}</td>
                      <td>{r.impactScore}</td>
                      <td>{r.businessValue}</td>
                    </>
                  )}
                  <td>{r.priorityScore}</td>
                  <td>
                    <Badge tone={priorityTone(r.priority)}>{r.priority}</Badge>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function PainDetail({ id }: { id: string }) {
  const p = painPoints.find((x) => x.id === id) || painPoints[0];
  return (
    <Page>
      <PageHeader
        title={p.name}
        description="AI 建议的用户痛点 · 需要 PM 审核"
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
          note="占有效数据集"
        />
        <Metric
          label="负面反馈"
          value={`${p.negativeRate}%`}
          note="相关反馈中的占比"
        />
        <Metric label="置信度" value={`${p.confidence}%`} note="AI 分类自评" />
      </div>
      <div className="grid two section">
        <div className="card">
          <h2>AI 摘要</h2>
          <p>{p.description}</p>
          <Badge>AI 建议</Badge>
          <Section title="痛点构成">
            {p.subtopics.map((s) => (
              <div key={s.name} style={{ margin: "14px 0" }}>
                <div className="section-title">
                  <span>{s.name}</span>
                  <strong>{s.percentage}%</strong>
                </div>
                <div className="bar">
                  <i style={{ width: `${s.percentage}%` }} />
                </div>
              </div>
            ))}
          </Section>
        </div>
        <div>
          <div className="card">
            <h2>用户需求</h2>
            <p>{p.userNeed}</p>
          </div>
          <div className="card section">
            <h2>产品机会</h2>
            <p>{p.opportunity}</p>
            <Btn
              href={`/requirements/${requirements.find((r) => r.painPointId === p.id)?.id || "search-optimization"}`}
              primary
            >
              创建产品需求
            </Btn>
          </div>
        </div>
      </div>
      <Section
        title="支持证据"
        link={
          <Link className="link" href={`/evidence/${p.id}`}>
            查看全部 {p.feedbackCount} 条证据 →
          </Link>
        }
      >
        <div className="card">
          {p.supportingFeedbackIds.slice(0, 3).map((id) => {
            const f = feedback.find((x) => x.id === id);
            return (
              f && (
                <div className="evidence" style={{ marginBottom: 20 }} key={id}>
                  <strong>{id}</strong>
                  <p>“{f.content}”</p>
                  <span className="small">
                    {sourceLabel(f.source)} · {f.date} · {f.rating} 星
                  </span>
                </div>
              )
            );
          })}
        </div>
      </Section>
    </Page>
  );
}
function Evidence({ id }: { id: string }) {
  const p = painPoints.find((x) => x.id === id) || painPoints[0];
  const items = p.supportingFeedbackIds
    .map((id) => feedback.find((f) => f.id === id))
    .filter(Boolean);
  return (
    <Page>
      <PageHeader
        title="支持证据"
        description={`${p.feedbackCount} 条原始反馈支持“${p.name}”洞察，证据 ID 全程可追溯。`}
        action={
          <Btn href={`/pain-points/${p.id}`}>
            <ArrowLeft size={16} /> 返回用户痛点
          </Btn>
        }
      />
      {items.length === 0 ? (
        <State
          title="证据不足"
          text="该洞察已被限制，当前无法据此创建产品需求。"
        />
      ) : (
        <div className="card">
          {items.map((f) => (
            <div className="evidence" style={{ marginBottom: 24 }} key={f!.id}>
              <div className="section-title">
                <strong>{f!.id}</strong>
                <Badge tone={f!.sentiment === "negative" ? "danger" : "info"}>
                  {sentimentLabel(f!.sentiment)}
                </Badge>
              </div>
              <p style={{ fontSize: 16 }}>“{f!.content}”</p>
              <span className="small">
                {sourceLabel(f!.source)} · {f!.date} · {f!.rating} 星
              </span>
            </div>
          ))}
          <Btn
            href={`/requirements/${requirements.find((r) => r.painPointId === p.id)?.id || "search-optimization"}`}
            primary
          >
            创建产品需求
          </Btn>
        </div>
      )}
    </Page>
  );
}

function RequirementList() {
  return (
    <Page>
      <PageHeader
        title="产品需求"
        description="AI 提供透明的评分依据，最终决策仍由 PM 掌握。"
      />
      <RequirementsTable />
    </Page>
  );
}
function RequirementDetail({ id }: { id: string }) {
  const initial = requirements.find((x) => x.id === id) || requirements[0];
  const [businessValue, setBusinessValue] = useState(initial.businessValue),
    [manual, setManual] = useState<Priority | null>(null),
    [saved, setSaved] = useState(false);
  const score = calculatePriorityScore({
    frequency: initial.frequencyScore,
    severity: initial.severityScore,
    impact: initial.impactScore,
    businessValue,
    confidence: initial.confidenceScore,
  });
  const ai = getPriorityFromScore(score);
  return (
    <Page>
      <PageHeader
        title={initial.title}
        description="优先级评审 · AI 建议仅供参考"
        action={
          <Btn href={`/prd/${initial.id}`} primary>
            生成 PRD
          </Btn>
        }
      />
      {initial.confidenceScore < 60 && (
        <div className="alert warning">
          置信度较低 · 请先审核支持证据再做决定。
        </div>
      )}
      <div className="grid two">
        <div className="card">
          <h2>优先级得分</h2>
          <div className="metric-value">{score}</div>
          <div className="grid">
            {[
              ["反馈频率", initial.frequencyScore],
              ["严重程度", initial.severityScore],
              ["用户影响", initial.impactScore],
              ["商业价值", businessValue],
              ["置信度", initial.confidenceScore],
            ].map(([n, v]) => (
              <div key={n} style={{ marginBottom: 10 }}>
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
          <p className="small">
            反馈频率 × 0.30 + 严重程度 × 0.25 + 用户影响 × 0.20 + 商业价值 ×
            0.15 + 置信度 × 0.10
          </p>
        </div>
        <div>
          <div className="card">
            <h2>PM 决策输入</h2>
            <div className="field">
              <label>商业价值：{businessValue}</label>
              <input
                type="range"
                min="0"
                max="100"
                value={businessValue}
                onChange={(e) => setBusinessValue(Number(e.target.value))}
              />
              <span className="small">
                AI 无法获知 NovaNote 当前真实的商业战略。
              </span>
            </div>
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
                {["P0", "P1", "P2", "P3"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <Btn primary onClick={() => setSaved(true)}>
              保存决策
            </Btn>
          </div>
          <div className="card section">
            <div className="section-title">
              <span>AI 建议</span>
              <Badge tone={priorityTone(ai)}>{ai}</Badge>
            </div>
            <div className="section-title">
              <span>PM 最终决策</span>
              {manual ? (
                <Badge tone="human">{manual} · 人工覆盖</Badge>
              ) : (
                <span className="small">尚未设置</span>
              )}
            </div>
            {saved && (
              <div className="alert success">
                决策已保存，AI 的原始建议仍会保留。
              </div>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}

function PRD({ id }: { id: string }) {
  const requirement = requirements.find((r) => r.id === id) || requirements[0];
  const pain =
    painPoints.find((p) => p.id === requirement.painPointId) || painPoints[0];
  const [sections, setSections] = useState(prdDraft.sections),
    [toast, setToast] = useState("");
  const markdown = useMemo(
    () =>
      `# ${requirement.title}\n\n` +
      Object.entries(sections)
        .map(([k, v]) => `## ${prdSectionLabel(k)}\n\n${v}`)
        .join("\n\n"),
    [sections, requirement.title],
  );
  function notify(x: string) {
    setToast(x);
    setTimeout(() => setToast(""), 1800);
  }
  async function copy() {
    await navigator.clipboard.writeText(markdown);
    notify("Markdown 已复制");
  }
  function download() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([markdown], { type: "text/markdown" }),
    );
    a.download = `${requirement.id}-prd.md`;
    a.click();
    URL.revokeObjectURL(a.href);
    notify("Markdown 已导出");
  }
  return (
    <Page>
      <PageHeader
        title={`${requirement.title} PRD`}
        description="可编辑的演示草稿 · 基于已审核的来源信息生成"
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <Btn disabled>重新生成</Btn>
            <Btn onClick={copy}>
              <Clipboard size={16} /> 复制 Markdown
            </Btn>
            <Btn primary onClick={download}>
              <Download size={16} /> 导出 Markdown
            </Btn>
          </div>
        }
      />
      <div className="alert warning">配置 AI 模型后才能使用重新生成功能。</div>
      <div className="split">
        <div className="card editor">
          {Object.entries(sections).map(([key, value]) => (
            <div className="field" key={key}>
              <label>{prdSectionLabel(key)}</label>
              <textarea
                className="textarea"
                value={value}
                onChange={(e) =>
                  setSections({ ...sections, [key]: e.target.value })
                }
              />
            </div>
          ))}
        </div>
        <aside
          className="card"
          style={{ height: "fit-content", position: "sticky", top: 96 }}
        >
          <h2>来源信息</h2>
          <div className="field">
            <span className="small">用户痛点</span>
            <strong>{pain.name}</strong>
          </div>
          <div className="field">
            <span className="small">用户需求</span>
            <span>{pain.userNeed}</span>
          </div>
          <div className="field">
            <span className="small">产品需求</span>
            <strong>{requirement.title}</strong>
          </div>
          <div className="field">
            <span className="small">支持证据</span>
            <Link className="link" href={`/evidence/${pain.id}`}>
              {pain.feedbackCount} 条反馈 →
            </Link>
          </div>
          <div className="section-title">
            <span>优先级</span>
            <Badge tone={priorityTone(requirement.priority)}>
              {requirement.priority}
            </Badge>
          </div>
          <div className="section-title">
            <span>置信度</span>
            <strong>{pain.confidence}%</strong>
          </div>
        </aside>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </Page>
  );
}

function States() {
  return (
    <Page>
      <PageHeader
        title="产品状态"
        description="完整展示产品中的可操作状态与异常处理。"
      />
      <div className="grid two">
        <State
          title="尚未分析任何反馈"
          text="开始你的第一次用户反馈分析。"
          action={
            <Btn href="/projects/new" primary>
              新建分析
            </Btn>
          }
        />
        <State title="还没有用户研究项目" text="创建研究项目来管理用户反馈。" />
        <State
          title="文件格式无效"
          text="请上传 CSV 或 XLSX 文件。"
          tone="danger"
        />
        <State
          title="数据集为空"
          text="请上传至少包含一条用户反馈的文件。"
          tone="danger"
        />
        <State
          title="缺少反馈字段"
          text="请选择包含用户反馈内容的字段。"
          tone="danger"
        />
        <State
          title="部分 AI 分析失败"
          text="已分析 1,239 条，失败 9 条。可以仅重试失败项。"
          tone="warning"
        />
        <State
          title="置信度较低"
          text="接受该洞察前，请先审核支持证据。"
          tone="warning"
        />
        <State
          title="证据不足"
          text="该洞察当前不能用于创建产品需求。"
          tone="danger"
        />
        <div className="card">
          <h2>加载中</h2>
          <div className="skeleton" />
          <div className="skeleton section" />
        </div>
        <State
          title="产品需求已创建"
          text="等待 PM 审核，优先级仍可编辑。"
          tone="success"
        />
      </div>
    </Page>
  );
}
function State({
  title,
  text,
  action,
  tone,
}: {
  title: string;
  text: string;
  action?: React.ReactNode;
  tone?: "danger" | "warning" | "success";
}) {
  return (
    <div className="card">
      <div className={tone ? `alert ${tone}` : ""}>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      {action}
    </div>
  );
}

export function ProductApp({ route }: { route: string[] }) {
  const path = "/" + route.join("/");
  if (path === "/" || path === "/dashboard") return <Dashboard />;
  if (path === "/projects") return <Projects />;
  if (path === "/projects/new") return <CreateProject />;
  if (path === "/projects/new/upload") return <UploadPage />;
  if (path === "/projects/new/mapping") return <Mapping />;
  if (path === "/processing") return <Processing />;
  if (route[0] === "projects" && route[2] === "analysis")
    return <LiveAnalysisPage />;
  if (route[0] === "pain-points") return <LivePainDetail id={route[1]} />;
  if (route[0] === "evidence") return <LiveEvidence id={route[1]} />;
  if (path === "/requirements") return <LiveRequirements />;
  if (route[0] === "requirements")
    return <LiveRequirementDetail id={route[1]} />;
  if (route[0] === "opportunities") return <LiveOpportunity id={route[1]} />;
  if (route[0] === "prd") return <LivePRD id={route[1]} />;
  if (path === "/states") return <States />;
  return (
    <Page>
      <State
        title="页面不存在"
        text="返回 InsightFlow 仪表盘。"
        action={
          <Btn href="/dashboard" primary>
            返回仪表盘
          </Btn>
        }
      />
    </Page>
  );
}
