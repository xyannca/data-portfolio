"use client";

import { useState, useEffect, useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Activity, Cpu, Database, GitBranch, AlertTriangle, CheckCircle2 } from "lucide-react";

/**
 * AIProjectDashboard
 * ------------------
 * Drop-in "AI Project" showcase panel — styled as a live systems monitor
 * rather than a generic stats grid. Built to sit inside a dark portfolio
 * section; pass your own data via props once you wire it to a real source
 * (or leave the seeded demo data for a static showcase).
 *
 * Integration notes:
 * - Requires `recharts` and `lucide-react` (npm install recharts lucide-react)
 * - Uses Tailwind utility classes — no extra CSS file needed if Tailwind
 *   is already configured in your Next.js project
 * - All colors are set via inline hex so the panel reads correctly even
 *   if your site's Tailwind theme doesn't define these tokens
 */

const palette = {
  bg: "#12151C",
  panel: "#171B24",
  panelAlt: "#1B202B",
  border: "#262C3A",
  textPrimary: "#E8EAED",
  textSecondary: "#8B93A7",
  textMuted: "#5B6274",
  cyan: "#5EEAD4",
  amber: "#F5A623",
  rose: "#F87171",
};

// ---- Demo data (swap for live values once wired to a real pipeline) ----

function useSeededPulse(points = 40) {
  return useMemo(() => {
    const arr = [];
    let v = 62;
    for (let i = 0; i < points; i++) {
      v += (Math.random() - 0.48) * 9;
      v = Math.max(20, Math.min(95, v));
      arr.push({ t: i, v: Math.round(v) });
    }
    return arr;
  }, []);
}

const throughputSeries = [
  { t: "00:00", requests: 120 },
  { t: "04:00", requests: 95 },
  { t: "08:00", requests: 310 },
  { t: "12:00", requests: 480 },
  { t: "16:00", requests: 402 },
  { t: "20:00", requests: 260 },
  { t: "24:00", requests: 150 },
];

const pipelineStages = [
  { name: "Ingest", status: "ok", detail: "1.2k events/min" },
  { name: "Embed", status: "ok", detail: "avg 84ms" },
  { name: "Retrieve", status: "warn", detail: "p95 elevated" },
  { name: "Generate", status: "ok", detail: "avg 640ms" },
];

const statusStyles = {
  ok: { color: palette.cyan, icon: CheckCircle2, label: "healthy" },
  warn: { color: palette.amber, icon: AlertTriangle, label: "degraded" },
  error: { color: palette.rose, icon: AlertTriangle, label: "error" },
};

function MetricCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div
      style={{ background: palette.panel, border: `1px solid ${palette.border}` }}
      className="rounded-lg px-4 py-3 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <span style={{ color: palette.textSecondary }} className="text-xs tracking-wide uppercase">
          {label}
        </span>
        <Icon size={14} style={{ color: accent || palette.textMuted }} />
      </div>
      <div style={{ color: palette.textPrimary, fontFamily: "var(--font-mono, ui-monospace, monospace)" }} className="text-2xl font-medium tabular-nums">
        {value}
      </div>
      {sub && (
        <span style={{ color: palette.textMuted }} className="text-xs">
          {sub}
        </span>
      )}
    </div>
  );
}

function PulseBar() {
  const data = useSeededPulse(48);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{ background: palette.panel, border: `1px solid ${palette.border}` }}
      className="rounded-lg px-4 py-3"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            style={{ background: palette.cyan }}
            className="w-2 h-2 rounded-full inline-block animate-pulse"
          />
          <span style={{ color: palette.textSecondary }} className="text-xs tracking-wide uppercase">
            Pipeline pulse
          </span>
        </div>
        <span style={{ color: palette.textMuted, fontFamily: "ui-monospace, monospace" }} className="text-xs">
          live · refresh {tick}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={70}>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={palette.cyan}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function StageRow({ stage }) {
  const s = statusStyles[stage.status];
  const Icon = s.icon;
  return (
    <div
      style={{ borderBottom: `1px solid ${palette.border}` }}
      className="flex items-center justify-between py-2.5 last:border-b-0"
    >
      <div className="flex items-center gap-2.5">
        <Icon size={14} style={{ color: s.color }} />
        <span style={{ color: palette.textPrimary }} className="text-sm">
          {stage.name}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span style={{ color: palette.textMuted, fontFamily: "ui-monospace, monospace" }} className="text-xs">
          {stage.detail}
        </span>
        <span
          style={{ color: s.color, background: `${s.color}1A` }}
          className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded"
        >
          {s.label}
        </span>
      </div>
    </div>
  );
}

export default function AIProjectDashboard() {
  return (
    <div style={{ background: palette.bg }} className="w-full rounded-xl p-5 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 style={{ color: palette.textPrimary }} className="text-lg font-medium">
            AI pipeline monitor
          </h2>
          <p style={{ color: palette.textMuted }} className="text-xs mt-0.5">
            Live operational view of the retrieval-augmented pipeline
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span style={{ background: palette.cyan }} className="w-1.5 h-1.5 rounded-full" />
          <span style={{ color: palette.textSecondary }} className="text-xs">
            operational
          </span>
        </div>
      </div>

      {/* Metric row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MetricCard icon={Activity} label="Requests / min" value="482" sub="+12% vs. yesterday" accent={palette.cyan} />
        <MetricCard icon={Cpu} label="Avg latency" value="640ms" sub="p95: 1.1s" accent={palette.amber} />
        <MetricCard icon={Database} label="Token throughput" value="18.4k/s" sub="rolling 5min" accent={palette.cyan} />
        <MetricCard icon={GitBranch} label="Error rate" value="0.4%" sub="last 24h" accent={palette.textMuted} />
      </div>

      {/* Main grid: pulse + throughput on left, pipeline stages on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <PulseBar />
          <div
            style={{ background: palette.panel, border: `1px solid ${palette.border}` }}
            className="rounded-lg px-4 py-3"
          >
            <span style={{ color: palette.textSecondary }} className="text-xs tracking-wide uppercase">
              Request volume · 24h
            </span>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={throughputSeries} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke={palette.border} vertical={false} />
                <XAxis dataKey="t" stroke={palette.textMuted} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={palette.textMuted} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: palette.panelAlt, border: `1px solid ${palette.border}`, borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: palette.textSecondary }}
                  itemStyle={{ color: palette.cyan }}
                />
                <Area type="monotone" dataKey="requests" stroke={palette.cyan} fill={palette.cyan} fillOpacity={0.12} strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          style={{ background: palette.panel, border: `1px solid ${palette.border}` }}
          className="rounded-lg px-4 py-3"
        >
          <span style={{ color: palette.textSecondary }} className="text-xs tracking-wide uppercase">
            Pipeline stages
          </span>
          <div className="mt-1">
            {pipelineStages.map((stage) => (
              <StageRow key={stage.name} stage={stage} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
