"use client";
// app/clearsight/page.tsx
// Complete ClearSight v3 — Dashboard + AI Insights + AI Chat + AI Generator + PDF Export
// FIXED: BarChart now receives filters/toggle as props (was referencing outer scope variables)
// FIXED: quickAsk now directly calls sendChat instead of synthetic keyboard event

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ── TYPES ──
type DataRow = { month: string; market: string; type: string; calls: number; rr: number };
type Filters = { month: string | null; market: string | null; type: string | null };
type Tab = "dashboard" | "insights" | "chat" | "generator";
type GenMode = "prompt" | "screenshot" | "auto";
type ChatMsg = { role: "ai" | "user"; text: string };

// ── CONSTANTS ──
const MONTHS = ["January", "February", "March"];
const MARKETS = ["market_1", "market_2", "market_3"];
const TYPES = ["type_1", "type_2", "type_3", "type_4", "type_5"];
const MCOLORS = ["#0d9488", "#2563eb", "#7c3aed"];
const TCOLORS = ["#0d9488", "#2563eb", "#7c3aed", "#d97706", "#dc2626"];

// ── SAMPLE DATA ──
const RAW: DataRow[] = [
  { month: "January", market: "market_1", type: "type_1", calls: 1400, rr: 91.2 },
  { month: "January", market: "market_1", type: "type_2", calls: 6800, rr: 95.0 },
  { month: "January", market: "market_1", type: "type_3", calls: 900, rr: 88.5 },
  { month: "January", market: "market_1", type: "type_4", calls: 2800, rr: 91.9 },
  { month: "January", market: "market_1", type: "type_5", calls: 9100, rr: 89.7 },
  { month: "January", market: "market_2", type: "type_1", calls: 600, rr: 95.2 },
  { month: "January", market: "market_2", type: "type_2", calls: 2600, rr: 94.7 },
  { month: "January", market: "market_2", type: "type_3", calls: 400, rr: 96.1 },
  { month: "January", market: "market_2", type: "type_4", calls: 1000, rr: 90.0 },
  { month: "January", market: "market_2", type: "type_5", calls: 3400, rr: 93.0 },
  { month: "January", market: "market_3", type: "type_1", calls: 800, rr: 64.8 },
  { month: "January", market: "market_3", type: "type_2", calls: 1200, rr: 94.7 },
  { month: "January", market: "market_3", type: "type_3", calls: 300, rr: 82.3 },
  { month: "January", market: "market_3", type: "type_4", calls: 500, rr: 90.0 },
  { month: "January", market: "market_3", type: "type_5", calls: 700, rr: 87.4 },
  { month: "February", market: "market_1", type: "type_1", calls: 1700, rr: 91.0 },
  { month: "February", market: "market_1", type: "type_2", calls: 8200, rr: 95.0 },
  { month: "February", market: "market_1", type: "type_3", calls: 1100, rr: 88.4 },
  { month: "February", market: "market_1", type: "type_4", calls: 3400, rr: 92.0 },
  { month: "February", market: "market_1", type: "type_5", calls: 11000, rr: 89.6 },
  { month: "February", market: "market_2", type: "type_1", calls: 700, rr: 95.1 },
  { month: "February", market: "market_2", type: "type_2", calls: 3100, rr: 94.8 },
  { month: "February", market: "market_2", type: "type_3", calls: 500, rr: 96.1 },
  { month: "February", market: "market_2", type: "type_4", calls: 1200, rr: 90.0 },
  { month: "February", market: "market_2", type: "type_5", calls: 4100, rr: 92.9 },
  { month: "February", market: "market_3", type: "type_1", calls: 900, rr: 64.9 },
  { month: "February", market: "market_3", type: "type_2", calls: 1500, rr: 94.6 },
  { month: "February", market: "market_3", type: "type_3", calls: 400, rr: 82.2 },
  { month: "February", market: "market_3", type: "type_4", calls: 600, rr: 90.1 },
  { month: "February", market: "market_3", type: "type_5", calls: 800, rr: 87.5 },
  { month: "March", market: "market_1", type: "type_1", calls: 1100, rr: 91.3 },
  { month: "March", market: "market_1", type: "type_2", calls: 5100, rr: 95.1 },
  { month: "March", market: "market_1", type: "type_3", calls: 700, rr: 88.6 },
  { month: "March", market: "market_1", type: "type_4", calls: 2100, rr: 91.8 },
  { month: "March", market: "market_1", type: "type_5", calls: 6800, rr: 89.8 },
  { month: "March", market: "market_2", type: "type_1", calls: 400, rr: 95.2 },
  { month: "March", market: "market_2", type: "type_2", calls: 2000, rr: 94.8 },
  { month: "March", market: "market_2", type: "type_3", calls: 300, rr: 96.0 },
  { month: "March", market: "market_2", type: "type_4", calls: 800, rr: 90.0 },
  { month: "March", market: "market_2", type: "type_5", calls: 2500, rr: 93.1 },
  { month: "March", market: "market_3", type: "type_1", calls: 600, rr: 64.7 },
  { month: "March", market: "market_3", type: "type_2", calls: 900, rr: 94.7 },
  { month: "March", market: "market_3", type: "type_3", calls: 200, rr: 82.3 },
  { month: "March", market: "market_3", type: "type_4", calls: 400, rr: 90.0 },
  { month: "March", market: "market_3", type: "type_5", calls: 500, rr: 87.3 },
];

// ── HELPERS ──
function sumC(arr: DataRow[]): number { return arr.reduce((s, r) => s + r.calls, 0); }
function avgR(arr: DataRow[]): number {
  const t = sumC(arr);
  return t ? arr.reduce((s, r) => s + r.rr * r.calls, 0) / t : 0;
}
function fmtK(n: number): string { return n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n); }

// ── INSIGHTS DATA ──
const INSIGHTS: Record<string, { title: string; body: string }> = {
  fcr: { title: "Why is FCR only 8.6%?", body: "A 8.6% FCR means agents fail to resolve issues 91.4% of the time — 10x worse than industry standard of 70-75%. Root causes typically include agents lacking authority to resolve issues, inadequate knowledge base, or complex multi-department problems. type_5 accounts for 47% of all call volume and is the highest priority investigation target." },
  anomaly: { title: "market_2 × type_3: 96.10% — Critical Anomaly", body: "At 96.10%, virtually every customer in this segment calls back after first contact. This indicates a near-total resolution failure — only 3.9% resolved on first contact. Immediate action: pull call recordings, identify the top 3 unresolved issue patterns, and escalate to product or operations within 48 hours." },
  benchmark: { title: "Best Benchmark: market_3 × type_1 at 64.82%", body: "This cell is 26.6 percentage points better than the dataset average. Whatever processes, agent behaviors, or issue types exist here are working significantly better. Recommended: deep-dive on recordings, document what agents do differently, run a 30-day pilot replicating those practices in market_2 × type_3." },
  actions: { title: "Top 3 Management Actions", body: "1. URGENT: Task force on market_2 × type_3 this week — 96.10% repeat rate is unacceptable and requires immediate investigation.\n\n2. HIGH PRIORITY: Study market_3 × type_1 success factors and build into training for all segments.\n\n3. STRATEGIC: type_5 is 47% of all calls — improving FCR to just 30% eliminates ~17K repeat calls per quarter." },
  feb: { title: "Why Did February Spike to 25K?", body: "February shows a 19% increase over January before dropping in March. Most likely causes: a product or service issue introduced in late January generating callbacks, a billing cycle event common in telecoms/utilities, or seasonal demand. Recommend correlating with product changes, outage events, or billing dates from that period." },
};

// ── CHAT RESPONSES ──
const CHAT_RESPONSES: Record<string, string> = {
  fcr: "The 8.6% FCR is critically low — industry average is 70-75%. This means 9 out of 10 customers must call back. type_5 represents 47% of volume and should be the first investigation priority for your team.",
  market: "market_1 has the highest volume at ~45K calls (70% of total). market_2 has the worst repeat rate at 93.96%. market_3 performs best at 87.19% — their practices should be studied and replicated across all segments.",
  anomaly: "market_2 × type_3 at 96.10% is the critical anomaly — virtually no first-call resolution. This is 26+ points worse than the best-performing cell: market_3 × type_1 at 64.82%. That gap is your biggest opportunity.",
  default: "Based on the data, the most urgent issue is the 91.4% overall repeat call rate. I recommend focusing on market_2 × type_3 first as the highest-priority anomaly, then replicating market_3 × type_1 best practices across all segments.",
};

// ── BAR CHART (CSS) ──
// FIX: Now receives filters and toggle as props instead of closing over outer scope variables
function BarChart({
  labels,
  values,
  colors,
  filterDim,
  filters,
  toggle,
}: {
  labels: string[];
  values: number[];
  colors: string[];
  filterDim: keyof Filters;
  filters: Filters;
  toggle: (dim: keyof Filters, val: string) => void;
}) {
  const max = Math.max(...values, 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {labels.map((l, i) => {
        const sel = filters[filterDim] === l;
        const dim = filters[filterDim] && !sel;
        return (
          <div
            key={l}
            onClick={() => toggle(filterDim, l)}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "3px 6px",
              borderRadius: 6, cursor: "pointer", opacity: dim ? 0.2 : 1,
              background: sel ? "#f0fdfa" : "transparent",
              border: `1.5px solid ${sel ? "#99f6e4" : "transparent"}`,
              transition: "all 0.12s",
            }}
          >
            <span style={{ fontSize: 11, color: sel ? "#0f766e" : "#475569", minWidth: 72, fontWeight: sel ? 500 : 400 }}>
              {l.replace("market_", "mkt_").replace("January", "Jan").replace("February", "Feb").replace("March", "Mar")}
            </span>
            <div style={{ flex: 1, height: 20, background: "#f1f3f5", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.round(values[i] / max * 100)}%`, background: colors[i % colors.length], borderRadius: 4, transition: "width 0.3s" }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, color: sel ? "#0f766e" : "#475569", minWidth: 44, textAlign: "right" }}>{fmtK(values[i])}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── MAIN COMPONENT ──
export default function ClearSightPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [filters, setFilters] = useState<Filters>({ month: null, market: null, type: null });
  const [activeInsight, setActiveInsight] = useState<string | null>(null);
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([{ role: "ai", text: "Ask me anything about this call center data. I can explain anomalies, compare segments, or brief you for an executive presentation." }]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [genMode, setGenMode] = useState<GenMode>("prompt");
  const [genPrompt, setGenPrompt] = useState("");
  const [genApiKey, setGenApiKey] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genCode, setGenCode] = useState("");
  const [genScreenshot, setGenScreenshot] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMsgs]);

  useEffect(() => {
    document.body.classList.add("page-clearsight");
    return () => document.body.classList.remove("page-clearsight");
  }, []);

  // ── FILTER LOGIC ──
  const filtered = RAW.filter(r =>
    (!filters.month || r.month === filters.month) &&
    (!filters.market || r.market === filters.market) &&
    (!filters.type || r.type === filters.type)
  );
  const hasFilters = filters.month || filters.market || filters.type;
  const totalCalls = sumC(filtered);
  const repeatRate = avgR(filtered);
  const repeatCalls = Math.round(totalCalls * repeatRate / 100);
  const firstCalls = totalCalls - repeatCalls;

  function toggle(dim: keyof Filters, val: string) {
    setFilters(f => ({ ...f, [dim]: f[dim] === val ? null : val }));
  }
  function clearFilters() { setFilters({ month: null, market: null, type: null }); }

  // ── AI CHAT ──
  // FIX: Extracted sendChatWithMessage so it can be called directly with a question string
  async function sendChatWithMessage(q: string) {
    if (!q.trim() || chatLoading) return;
    setChatInput("");
    setChatMsgs(m => [...m, { role: "user", text: q }]);
    setChatLoading(true);
    try {
      const res = await fetch("/api/clearsight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are ClearSight AI analyst. Call center data: 64,900 total calls, 91.4% repeat rate, 8.6% FCR (industry avg 70-75%). Markets: market_1 (45K, 92.5% repeat), market_2 (15K, 93.96%), market_3 (4.9K, 87.19%). Critical anomaly: market_2×type_3 = 96.10%. Best benchmark: market_3×type_1 = 64.82%. Active filters: ${JSON.stringify(filters)}. User question: "${q}". Answer in 3-4 sentences, plain English, executive level.`
        }),
      });
      const data = await res.json();
      setChatMsgs(m => [...m, { role: "ai", text: data.text || "Unable to get response." }]);
    } catch {
      const k = q.toLowerCase().includes("fcr") || q.toLowerCase().includes("resolv") ? "fcr"
        : q.toLowerCase().includes("market") ? "market"
        : q.toLowerCase().includes("anomal") || q.toLowerCase().includes("96") ? "anomaly" : "default";
      setChatMsgs(m => [...m, { role: "ai", text: CHAT_RESPONSES[k] }]);
    }
    setChatLoading(false);
  }

  async function sendChat() {
    await sendChatWithMessage(chatInput.trim());
  }

  // FIX: quickAsk now directly calls sendChatWithMessage instead of relying on synthetic keyboard events
  function quickAsk(q: string) {
    sendChatWithMessage(q);
  }

  // ── AI GENERATOR ──
  async function generateDashboard() {
    if (!genApiKey.startsWith("sk-ant")) return;
    setGenLoading(true); setGenCode("");
    const userRequest = genMode === "auto"
      ? "Automatically choose the best dashboard layout for this call center data."
      : genMode === "screenshot" && genScreenshot
        ? (document.getElementById("ss-extra") as HTMLTextAreaElement)?.value || "Recreate the layout from the screenshot with this data."
        : genPrompt || "Create a professional dashboard with cross-filtering.";
    const systemPrompt = `You are a dashboard code generator. Generate a complete single-file HTML dashboard.
REQUIREMENTS: Cross-filtering on all charts, KPI cards, 3-4 charts, professional design matching user request.
Use Chart.js from cdnjs or pure CSS bars. Return ONLY complete HTML, no markdown, no backticks.
DATA: Call center data Jan-Mar 2023. 64,900 total calls. 91.4% repeat rate. 8.6% FCR (industry avg 70-75%).
Markets: market_1 (45K), market_2 (15K), market_3 (4.9K). Types: type_1-5.
Key anomaly: market_2×type_3 = 96.10% repeat rate. Best benchmark: market_3×type_1 = 64.82%.
USER REQUEST: ${userRequest}
Generate complete HTML now:`;
    try {
      const msgs = genMode === "screenshot" && genScreenshot
        ? [{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: "image/png", data: genScreenshot } }, { type: "text", text: systemPrompt }] }]
        : [{ role: "user", content: systemPrompt }];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": genApiKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 8000, messages: msgs }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      let code = data.content?.map((b: { text?: string }) => b.text || "").join("") || "";
      code = code.replace(/```html\n?/g, "").replace(/```\n?/g, "").trim();
      setGenCode(code);
    } catch (e: unknown) {
      alert("Error: " + (e instanceof Error ? e.message : "Check your API key"));
    }
    setGenLoading(false);
  }

  function handleScreenshotUpload(file: File) {
    const reader = new FileReader();
    reader.onload = e => setGenScreenshot(e.target?.result?.toString().split(",")[1] || "");
    reader.readAsDataURL(file);
  }

  // ── STYLES ──
  const s = {
    topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: 54, borderBottom: "1px solid #e5e7eb", background: "#fff", position: "sticky" as const, top: 0, zIndex: 9 },
    logo: { display: "flex", alignItems: "center", gap: 8 },
    logoMark: { width: 26, height: 26, borderRadius: "50%", border: "1.5px solid #0d9488", display: "flex", alignItems: "center", justifyContent: "center" },
    logoDot: { width: 7, height: 7, borderRadius: "50%", background: "#0d9488" },
    logoName: { fontFamily: "'DM Serif Display', serif", fontSize: 16, color: "#0f172a" },
    badge: (color: string) => ({ fontSize: 10, padding: "2px 9px", borderRadius: 99, fontWeight: 500, background: color === "teal" ? "#f0fdfa" : "#f1f3f5", color: color === "teal" ? "#0f766e" : "#475569", border: `1px solid ${color === "teal" ? "#99f6e4" : "#e5e7eb"}` }),
    btnSm: { fontFamily: "Inter, sans-serif", fontSize: 11, padding: "5px 12px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 } as React.CSSProperties,
    tabBtn: (active: boolean) => ({ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 500, padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer", color: active ? "#0d9488" : "#94a3b8", borderBottom: active ? "2px solid #0d9488" : "2px solid transparent", marginBottom: -1, transition: "all 0.15s", letterSpacing: "0.02em" } as React.CSSProperties),
    content: { padding: "16px 20px", display: "flex", flexDirection: "column" as const, gap: 12 },
    card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 15, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
    cardTitle: { fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: "#475569", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" },
  };

  // ── HEATMAP DATA ──
  function heatmapRate(mkt: string, tp: string): number | null {
    const d = filtered.filter(r => r.market === mkt && r.type === tp);
    return d.length ? avgR(d) : null;
  }
  function heatmapClass(v: number): React.CSSProperties {
    return v >= 94 ? { background: "#fef2f2", color: "#dc2626" }
      : v >= 80 ? { background: "#fff7ed", color: "#c2410c" }
      : { background: "#f0fdf4", color: "#15803d" };
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#f8f9fa", minHeight: "100vh", color: "#0f172a"}} className="clearsight-wrapper">

      {/* TOPBAR */}
      <div style={s.topbar}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ fontSize: 11, color: "#94a3b8", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, fontWeight: 500, letterSpacing: "0.03em" }}>
            ← Home
          </Link>
          <div style={s.logo}>
            <div style={s.logoMark}><div style={s.logoDot} /></div>
            <span style={s.logoName}>ClearSight</span>
            <span style={{ fontSize: 10, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase" as const, marginLeft: 3 }}>· AI Analytics</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={s.badge("gray")}>{sumC(filtered).toLocaleString()} calls</span>
          <span style={s.badge("teal")}>Powered by Claude</span>
          <button style={s.btnSm} onClick={() => window.print()}>📄 Export PDF</button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", background: "#fff", padding: "0 20px", overflowX: "auto" }}>
        {([["dashboard", "📊 Dashboard"], ["insights", "🧠 AI Insights"], ["chat", "💬 AI Chat"], ["generator", "✨ AI Generator"]] as [Tab, string][]).map(([t, label]) => (
          <button key={t} style={s.tabBtn(tab === t)} onClick={() => setTab(t)}>{label}</button>
        ))}
      </div>

      {/* ── DASHBOARD TAB ── */}
      {tab === "dashboard" && (
        <div style={s.content}>
          {/* Filter bar */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "9px 14px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8", fontWeight: 500 }}>Filters:</span>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", flex: 1 }}>
              {hasFilters ? (
                Object.entries(filters).filter(([, v]) => v).map(([k, v]) => (
                  <span key={k} style={{ fontSize: 11, padding: "2px 9px", borderRadius: 99, background: "#f0fdfa", color: "#0f766e", border: "1px solid #99f6e4", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    {k}: <strong>{v}</strong>
                    <span style={{ cursor: "pointer", marginLeft: 3 }} onClick={() => setFilters(f => ({ ...f, [k]: null }))}>×</span>
                  </span>
                ))
              ) : (
                <span style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic" }}>None — click any chart element to filter all</span>
              )}
            </div>
            {hasFilters && <button onClick={clearFilters} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, border: "1px solid #e5e7eb", background: "#fff", color: "#475569", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>✕ Clear all</button>}
          </div>

          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {[
              { label: "Total Calls", value: totalCalls.toLocaleString(), sub: hasFilters ? "Filtered view" : "Jan–Mar 2023", color: "#0d9488", subColor: "#475569" },
              { label: "First-Time Calls", value: firstCalls.toLocaleString(), sub: `${totalCalls ? (firstCalls / totalCalls * 100).toFixed(1) : 0}% of total`, color: "#2563eb", subColor: "#475569" },
              { label: "Repeat Calls", value: repeatCalls.toLocaleString(), sub: `${repeatRate.toFixed(1)}% repeat rate`, color: "#d97706", subColor: "#d97706" },
              { label: "Avg Repeat Rate", value: `${repeatRate.toFixed(1)}%`, sub: "↓ Target: <30%", color: "#dc2626", subColor: "#dc2626" },
            ].map((k, i) => (
              <div key={i} style={{ ...s.card, position: "relative", overflow: "hidden", padding: "13px 15px" }}>
                <div style={{ fontSize: 10, letterSpacing: "0.07em", textTransform: "uppercase", color: "#94a3b8", fontWeight: 500, marginBottom: 4 }}>{k.label}</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: "#0f172a" }}>{k.value}</div>
                <div style={{ fontSize: 11, marginTop: 2, color: k.subColor }}>{k.sub}</div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: k.color }} />
              </div>
            ))}
          </div>

          {/* Charts row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={s.card}>
              <div style={s.cardTitle}>Calls by Month <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 10 }}>click to filter</span></div>
              <BarChart
                labels={MONTHS}
                values={MONTHS.map(m => sumC(filtered.filter(r => r.month === m)))}
                colors={["#0d9488", "#2563eb", "#7c3aed"]}
                filterDim="month"
                filters={filters}
                toggle={toggle}
              />
            </div>
            <div style={s.card}>
              <div style={s.cardTitle}>Volume by Market <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 10 }}>click to filter</span></div>
              <BarChart
                labels={MARKETS}
                values={MARKETS.map(m => sumC(filtered.filter(r => r.market === m)))}
                colors={MCOLORS}
                filterDim="market"
                filters={filters}
                toggle={toggle}
              />
            </div>
          </div>

          {/* Charts row 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={s.card}>
              <div style={s.cardTitle}>Volume by Call Type <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 10 }}>click to filter</span></div>
              <BarChart
                labels={TYPES}
                values={TYPES.map(t => sumC(filtered.filter(r => r.type === t)))}
                colors={TCOLORS}
                filterDim="type"
                filters={filters}
                toggle={toggle}
              />
            </div>
            <div style={s.card}>
              <div style={s.cardTitle}>Repeat Rate by Market <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 10 }}>click to filter</span></div>
              <BarChart
                labels={MARKETS}
                values={MARKETS.map(m => { const d = filtered.filter(r => r.market === m); return d.length ? +avgR(d).toFixed(1) : 0; })}
                colors={MCOLORS}
                filterDim="market"
                filters={filters}
                toggle={toggle}
              />
            </div>
          </div>

          {/* Heatmap */}
          <div style={s.card}>
            <div style={s.cardTitle}>Repeat Call Rate Heatmap — Market × Type (%) <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 10 }}>click cell or market name to filter</span></div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr>
                  <th style={{ fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", color: "#94a3b8", fontWeight: 500, padding: "6px 8px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Market</th>
                  {TYPES.map(t => <th key={t} style={{ fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", color: "#94a3b8", fontWeight: 500, padding: "6px 8px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>{t}</th>)}
                  <th style={{ fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", color: "#94a3b8", fontWeight: 500, padding: "6px 8px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {MARKETS.map(mkt => {
                  const rowData = filtered.filter(r => r.market === mkt);
                  const dim = filters.market && filters.market !== mkt;
                  const msel = filters.market === mkt;
                  return (
                    <tr key={mkt} style={{ opacity: dim ? 0.2 : 1 }}>
                      <td onClick={() => toggle("market", mkt)} style={{ padding: "7px 8px", cursor: "pointer", color: msel ? "#0d9488" : "#475569", fontWeight: msel ? 600 : 400, borderBottom: "1px solid #e5e7eb" }}>{mkt}</td>
                      {TYPES.map(tp => {
                        const rate = heatmapRate(mkt, tp);
                        const isSel = filters.market === mkt && filters.type === tp;
                        return (
                          <td key={tp}
                            onClick={() => {
                              if (filters.market === mkt && filters.type === tp) {
                                setFilters(f => ({ ...f, market: null, type: null }));
                              } else {
                                setFilters(f => ({ ...f, market: mkt, type: tp }));
                              }
                            }}
                            style={{ padding: "7px 8px", textAlign: "center", fontWeight: 500, borderBottom: "1px solid #e5e7eb", cursor: "pointer", ...(rate !== null ? heatmapClass(rate) : {}), ...(isSel ? { outline: "2px solid #0d9488", outlineOffset: -1, background: "#f0fdfa", color: "#0f766e" } : {}) }}>
                            {rate !== null ? rate.toFixed(2) : "—"}
                          </td>
                        );
                      })}
                      <td style={{ padding: "7px 8px", textAlign: "center", fontWeight: 700, borderBottom: "1px solid #e5e7eb", color: "#0f172a" }}>{rowData.length ? avgR(rowData).toFixed(2) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              {[["#fef2f2", "#fecaca", "High ≥94%"], ["#fff7ed", "#fde68a", "Medium 80–93%"], ["#f0fdf4", "#bbf7d0", "Low <80%"]].map(([bg, border, label]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#94a3b8" }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: bg, border: `1px solid ${border}` }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── INSIGHTS TAB ── */}
      {tab === "insights" && (
        <div style={s.content}>
          <div style={{ background: "#f0fdfa", border: "1px solid #99f6e4", borderRadius: 12, padding: 15 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={s.logoMark}><div style={s.logoDot} /></div>
              <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: "#0f766e" }}>AI Executive Summary</span>
            </div>
            <p style={{ fontSize: 13, color: "#0f172a", lineHeight: 1.75 }}>
              This call center has a <strong>critical first-call resolution crisis</strong>: only 8.6% of calls are resolved on first contact, vs the 70–75% industry standard.
              The most urgent anomaly is <span style={{ background: "#fef2f2", color: "#dc2626", padding: "1px 6px", borderRadius: 4, fontSize: 11, fontWeight: 500 }}>market_2 × type_3 at 96.10%</span>.
              A strong benchmark exists: <span style={{ background: "#f0fdf4", color: "#15803d", padding: "1px 6px", borderRadius: 4, fontSize: 11, fontWeight: 500 }}>market_3 × type_1 at 64.82%</span> — study and replicate immediately.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
              {Object.keys(INSIGHTS).map(k => (
                <button key={k} onClick={() => setActiveInsight(activeInsight === k ? null : k)}
                  style={{ fontSize: 11, padding: "4px 12px", borderRadius: 99, background: activeInsight === k ? "#0d9488" : "#fff", color: activeInsight === k ? "#fff" : "#0f766e", border: "1px solid #99f6e4", cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 0.15s" }}>
                  {k === "fcr" ? "Why only 8.6% FCR?" : k === "anomaly" ? "market_2 × type_3" : k === "benchmark" ? "Best benchmark" : k === "actions" ? "Top 3 actions" : "Why Feb spike?"}
                </button>
              ))}
            </div>
            {activeInsight && (
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 14px", marginTop: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#0f766e", marginBottom: 6 }}>{INSIGHTS[activeInsight].title}</div>
                <div style={{ fontSize: 12, color: "#0f172a", lineHeight: 1.7 }}>
                  {INSIGHTS[activeInsight].body.split("\n\n").map((p, i, arr) => (
                    <p key={i} style={{ marginBottom: i < arr.length - 1 ? 8 : 0 }}>{p}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={s.card}>
              <div style={s.cardTitle}>Anomaly Detection</div>
              {[["market_2 × type_3", "96.10%", true], ["market_1 × type_2", "95.01%", true], ["market_2 × type_1", "95.17%", true], ["market_3 × type_1", "64.82% — benchmark", false]].map(([label, val, isAnomaly]) => (
                <div key={String(label)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: isAnomaly ? "#fef2f2" : "#f0fdf4", borderRadius: 8, border: `1px solid ${isAnomaly ? "#fecaca" : "#bbf7d0"}`, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: isAnomaly ? "#dc2626" : "#15803d", fontWeight: 500 }}>{isAnomaly ? "⚠ " : "✓ "}{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: isAnomaly ? "#dc2626" : "#15803d" }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={s.card}>
              <div style={s.cardTitle}>Recommended Actions</div>
              {[
                ["Urgent", "#dc2626", "Investigate market_2 × type_3 this week — pull recordings, identify top 3 failure patterns"],
                ["High Priority", "#d97706", "Replicate market_3 × type_1 practices across all segments within 30 days"],
                ["Strategic", "#0d9488", "type_5 is 47% of all calls — even 30% FCR improvement eliminates ~17K repeat calls/quarter"],
              ].map(([level, color, text]) => (
                <div key={String(level)} style={{ padding: "8px 10px", background: "#f8f9fa", borderRadius: 8, borderLeft: `3px solid ${color}`, marginBottom: 6 }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: String(color), marginBottom: 3, fontWeight: 500 }}>{level}</div>
                  <div style={{ fontSize: 12, color: "#0f172a", lineHeight: 1.5 }}>{text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CHAT TAB ── */}
      {tab === "chat" && (
        <div style={s.content}>
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10, minHeight: 280, maxHeight: 420, overflowY: "auto" }}>
              {chatMsgs.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: m.role === "ai" ? "#f0fdfa" : "#f1f3f5", border: `1px solid ${m.role === "ai" ? "#99f6e4" : "#e5e7eb"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600, flexShrink: 0, color: m.role === "ai" ? "#0f766e" : "#475569" }}>
                    {m.role === "ai" ? "AI" : "U"}
                  </div>
                  <div style={{ fontSize: 12, padding: "8px 12px", borderRadius: 8, maxWidth: "82%", lineHeight: 1.6, background: m.role === "ai" ? "#f8f9fa" : "#0d9488", color: m.role === "ai" ? "#0f172a" : "#fff", border: m.role === "ai" ? "1px solid #e5e7eb" : "none" }}>{m.text}</div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: "flex", gap: 7 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#f0fdfa", border: "1px solid #99f6e4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600, color: "#0f766e" }}>AI</div>
                  <div style={{ fontSize: 12, padding: "8px 12px", borderRadius: 8, background: "#f8f9fa", border: "1px solid #e5e7eb", color: "#94a3b8" }}>Thinking...</div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            {/* Quick-ask chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, padding: "0 14px 10px" }}>
              {["Why is FCR only 8.6%?", "Which market is most critical?", "What should management do?", "Explain market_2 × type_3"].map(q => (
                <span
                  key={q}
                  onClick={() => quickAsk(q)}
                  style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, border: "1px solid #e5e7eb", background: "#fff", color: "#475569", cursor: "pointer" }}
                >
                  {q}
                </span>
              ))}
            </div>
            <div style={{ borderTop: "1px solid #e5e7eb", padding: "10px 14px", display: "flex", gap: 7 }}>
              <input
                id="ci"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendChat()}
                placeholder="Ask anything about your data..."
                style={{ flex: 1, border: "1px solid #d1d5db", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontFamily: "Inter, sans-serif", outline: "none", color: "#0f172a" }}
              />
              <button onClick={sendChat} disabled={chatLoading} style={{ width: 34, height: 34, borderRadius: 8, background: "#0d9488", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── GENERATOR TAB ── */}
      {tab === "generator" && (
        <div style={s.content}>
          {/* Card 0 — replaces API key input */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#f0fdfa", border: "1px solid #99f6e4", fontSize: 9, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#0f766e" }}>✨</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Available in Full Version</span>
              <span style={{ marginLeft: "auto", fontSize: 10, padding: "2px 9px", borderRadius: 99, background: "#f0fdfa", color: "#0f766e", border: "1px solid #99f6e4", fontWeight: 500 }}>Demo</span>
            </div>
            <div style={{ padding: "14px 16px" }}>
              <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.7, margin: 0 }}>
                The AI Dashboard Generator is fully built and operational. In this portfolio demo it is disabled for security. To see a live walkthrough or discuss integration, contact the developer below.
              </p>
              <a href="mailto:xyannca@gmail.com" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, fontSize: 12, color: "#0d9488", fontWeight: 500, textDecoration: "none" }}>
                📩 Contact for full version access
              </a>
            </div>
          </div>
          {/* Card 1 — describe your dashboard (visual preview, inputs disabled) */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", opacity: 0.5, pointerEvents: "none" as const }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#0d9488", color: "#fff", fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>1</div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Describe Your Dashboard</span>
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {["✏️ Text Prompt", "🖼️ Screenshot", "✨ AI Decides"].map((label, i) => (
                  <div key={i} style={{ fontSize: 11, padding: "5px 12px", borderRadius: 99, border: "1px solid #d1d5db", background: i === 0 ? "#0d9488" : "#fff", color: i === 0 ? "#fff" : "#475569", fontWeight: 500 }}>{label}</div>
                ))}
              </div>
              <div style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 8, padding: "9px 12px", fontSize: 12, minHeight: 70, color: "#94a3b8", background: "#f8f9fa" }}>Describe your dashboard...</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 7 }}>
                {["Dark executive dashboard wit...", "Clean minimal white dashboar...", "Power BI style blue theme wi...", "Sales dashboard with monthly..."].map(p => (
                  <span key={p} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, border: "1px solid #e5e7eb", background: "#fff", color: "#475569" }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
          {/* Generate button — disabled */}
          <div style={{ width: "100%", padding: 13, background: "#94a3b8", color: "#fff", borderRadius: 12, fontSize: 13, fontWeight: 600, fontFamily: "Inter, sans-serif", letterSpacing: "0.04em", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            ✨ Generate AI Dashboard — Available in Full Version
          </div>
        </div>
      )}
    </div>
  );
}
