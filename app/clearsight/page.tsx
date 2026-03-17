"use client";
import { useState, useRef, useEffect } from "react";

// ── TYPES ──
type Row = Record<string, string | number>;
type Schema = Record<string, "number" | "string" | "date">;
type Filters = { dim1: string | null; dim2: string | null; dim3: string | null };

// ── HELPERS ──
function sumCalls(rows: Row[], col: string): number {
  return rows.reduce((s, r) => s + (Number(r[col]) || 0), 0);
}
function fmt(n: number): string {
  return n >= 1000000
    ? "$" + (n / 1000000).toFixed(1) + "M"
    : n >= 1000
    ? (n / 1000).toFixed(1) + "K"
    : String(Math.round(n));
}
function detectSchema(data: Row[]): Schema {
  const schema: Schema = {};
  if (!data.length) return schema;
  Object.keys(data[0]).forEach((col) => {
    const vals = data.map((r) => r[col]).filter((v) => v !== null && v !== "");
    const nums = vals.filter((v) => typeof v === "number");
    schema[col] = nums.length > vals.length * 0.6 ? "number" : "string";
  });
  return schema;
}

// ── SAMPLE DATA ──
const SAMPLE_CSV = `Month,Region,Product,Revenue,Units,Target
Jan,North,Widget A,142000,1420,130000
Jan,South,Widget B,98000,980,110000
Jan,East,Widget A,87000,870,90000
Feb,North,Widget A,155000,1550,140000
Feb,South,Widget B,112000,1120,110000
Feb,East,Widget C,63000,630,70000
Mar,North,Widget B,134000,1340,130000
Mar,South,Widget A,145000,1450,140000
Mar,East,Widget B,79000,790,85000
Apr,North,Widget C,98000,980,100000
Apr,South,Widget A,167000,1670,155000
Apr,East,Widget A,92000,920,90000
May,North,Widget A,178000,1780,165000
May,South,Widget B,89000,890,110000
May,East,Widget C,71000,710,75000`;

function parseCSV(csv: string): Row[] {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const vals = line.split(",");
    const row: Row = {};
    headers.forEach((h, i) => {
      const v = vals[i]?.trim() ?? "";
      row[h] = isNaN(Number(v)) || v === "" ? v : Number(v);
    });
    return row;
  });
}

// ── MAIN COMPONENT ──
export default function ClearSightPage() {
  const [data, setData] = useState<Row[]>([]);
  const [schema, setSchema] = useState<Schema>({});
  const [fileName, setFileName] = useState("");
  const [filters, setFilters] = useState<Filters>({ dim1: null, dim2: null, dim3: null });
  const [chatMessages, setChatMessages] = useState<{ role: string; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "chat">("dashboard");
  const fileRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Load sample data on mount
  useEffect(() => {
    const rows = parseCSV(SAMPLE_CSV);
    setData(rows);
    setSchema(detectSchema(rows));
    setFileName("sample_sales.csv");
  }, []);

  function handleFile(file: File) {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const rows = parseCSV(csv);
      setData(rows);
      setSchema(detectSchema(rows));
      setFilters({ dim1: null, dim2: null, dim3: null });
      setChatMessages([]);
    };
    reader.readAsText(file);
  }

  // Derived
  const cols = data.length ? Object.keys(data[0]) : [];
  const numCols = cols.filter((c) => schema[c] === "number");
  const strCols = cols.filter((c) => schema[c] === "string");
  const metricCol = numCols[0] ?? "";
  const metric2Col = numCols[1] ?? "";
  const dim1Col = strCols[0] ?? "";
  const dim2Col = strCols[1] ?? "";
  const dim3Col = strCols[2] ?? "";

  const filtered = data.filter(
    (r) =>
      (!filters.dim1 || r[dim1Col] === filters.dim1) &&
      (!filters.dim2 || r[dim2Col] === filters.dim2) &&
      (!filters.dim3 || r[dim3Col] === filters.dim3)
  );

  function toggleFilter(dim: keyof Filters, val: string) {
    setFilters((f) => ({ ...f, [dim]: f[dim] === val ? null : val }));
  }
  function clearFilters() {
    setFilters({ dim1: null, dim2: null, dim3: null });
  }

  function uniqueVals(col: string) {
    return [...new Set(data.map((r) => String(r[col])))];
  }
  function aggBy(col: string, metric: string) {
    const result: Record<string, number> = {};
    filtered.forEach((r) => {
      const k = String(r[col]);
      result[k] = (result[k] || 0) + (Number(r[metric]) || 0);
    });
    return result;
  }

  const hasFilters = filters.dim1 || filters.dim2 || filters.dim3;
  const totalMetric = sumCalls(filtered, metricCol);
  const totalMetric2 = sumCalls(filtered, metric2Col);
  const COLORS = ["#0d9488", "#2563eb", "#7c3aed", "#d97706", "#dc2626", "#059669", "#0891b2"];

  // ── AI CHAT ──
  async function sendChat() {
    if (!chatInput.trim() || chatLoading) return;
    const q = chatInput.trim();
    setChatInput("");
    setChatMessages((m) => [...m, { role: "user", text: q }]);
    setChatLoading(true);

    const numStats: Record<string, { total: number; avg: number; min: number; max: number }> = {};
    numCols.forEach((col) => {
      const vals = data.map((r) => Number(r[col])).filter((v) => !isNaN(v));
      numStats[col] = {
        total: vals.reduce((a, b) => a + b, 0),
        avg: vals.reduce((a, b) => a + b, 0) / vals.length,
        min: Math.min(...vals),
        max: Math.max(...vals),
      };
    });

    const prompt = `You are ClearSight, an expert AI data analyst. Dataset: "${fileName}" with ${data.length} rows.
Columns: ${cols.join(", ")}
Numeric stats: ${JSON.stringify(numStats)}
Sample (5 rows): ${JSON.stringify(data.slice(0, 5))}
Active filters: ${JSON.stringify(filters)}
Filtered rows: ${filtered.length}

User question: "${q}"

Answer in 3-4 sentences, plain English, executive level. Be specific with numbers.`;

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const json = await res.json();
      setChatMessages((m) => [...m, { role: "ai", text: json.text || "Unable to get response." }]);
    } catch {
      setChatMessages((m) => [...m, { role: "ai", text: "API error. Check your Claude API key in .env.local." }]);
    }
    setChatLoading(false);
  }

  if (!data.length) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa" }}>
        <p style={{ fontFamily: "monospace", color: "#94a3b8" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f8f9fa", minHeight: "100vh" }}>

      {/* TOPBAR */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", border: "1.5px solid #0d9488", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#0d9488" }} />
          </div>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 17 }}>ClearSight</span>
          <span style={{ fontSize: 10, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginLeft: 4 }}>· AI Analytics</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 99, background: "#f0fdfa", color: "#0f766e", border: "1px solid #99f6e4", fontWeight: 500 }}>
            {filtered.length} / {data.length} rows
          </span>
          <label style={{ fontSize: 11, padding: "5px 14px", borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", color: "#475569", cursor: "pointer" }}>
            Upload CSV
            <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </label>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", display: "flex", gap: 0 }}>
        {(["dashboard", "chat"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ fontFamily: "inherit", fontSize: 12, fontWeight: 500, padding: "10px 18px", border: "none", background: "transparent", cursor: "pointer", color: activeTab === tab ? "#0d9488" : "#94a3b8", borderBottom: activeTab === tab ? "2px solid #0d9488" : "2px solid transparent", marginBottom: -1, letterSpacing: "0.04em", textTransform: "capitalize" }}>
            {tab === "chat" ? "AI Chat" : "Dashboard"}
          </button>
        ))}
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* FILTER BAR */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8", fontWeight: 500 }}>Filters:</span>
          {hasFilters ? (
            <>
              {filters.dim1 && <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 99, background: "#f0fdfa", color: "#0f766e", border: "1px solid #99f6e4", fontWeight: 500 }}>{dim1Col}: {filters.dim1} <span style={{ cursor: "pointer" }} onClick={() => setFilters(f => ({ ...f, dim1: null }))}>×</span></span>}
              {filters.dim2 && <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 99, background: "#f0fdfa", color: "#0f766e", border: "1px solid #99f6e4", fontWeight: 500 }}>{dim2Col}: {filters.dim2} <span style={{ cursor: "pointer" }} onClick={() => setFilters(f => ({ ...f, dim2: null }))}>×</span></span>}
              {filters.dim3 && <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 99, background: "#f0fdfa", color: "#0f766e", border: "1px solid #99f6e4", fontWeight: 500 }}>{dim3Col}: {filters.dim3} <span style={{ cursor: "pointer" }} onClick={() => setFilters(f => ({ ...f, dim3: null }))}>×</span></span>}
              <button onClick={clearFilters} style={{ fontFamily: "inherit", fontSize: 11, padding: "3px 10px", borderRadius: 99, border: "1px solid #e5e7eb", background: "#fff", color: "#475569", cursor: "pointer" }}>✕ Clear all</button>
            </>
          ) : (
            <span style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic" }}>None — click any row to filter all charts</span>
          )}
        </div>

        {activeTab === "dashboard" && (
          <>
            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {[
                { label: metricCol, value: fmt(totalMetric), color: "#0d9488" },
                { label: metric2Col || "Rows", value: metric2Col ? fmt(totalMetric2) : String(filtered.length), color: "#2563eb" },
                { label: "Filtered", value: `${filtered.length} rows`, color: "#7c3aed" },
              ].map((k, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px", position: "relative", overflow: "hidden" }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 5, fontWeight: 500 }}>{k.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 600, color: "#0f172a" }}>{k.value}</div>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: k.color }} />
                </div>
              ))}
            </div>

            {/* CHARTS */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

              {/* Dim1 chart */}
              {dim1Col && (
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#475569", marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
                    <span>{metricCol} by {dim1Col}</span>
                    <span style={{ fontWeight: 400, color: "#94a3b8", textTransform: "none", letterSpacing: 0 }}>click to filter</span>
                  </div>
                  {(() => {
                    const agg = aggBy(dim1Col, metricCol);
                    const allVals = uniqueVals(dim1Col);
                    const max = Math.max(...Object.values(agg), 1);
                    return allVals.map((v, i) => {
                      const val = agg[v] || 0;
                      const sel = filters.dim1 === v;
                      const dim = filters.dim1 && !sel;
                      return (
                        <div key={v} onClick={() => toggleFilter("dim1", v)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 6px", borderRadius: 6, cursor: "pointer", marginBottom: 4, opacity: dim ? 0.25 : 1, background: sel ? "#f0fdfa" : "transparent", border: `1.5px solid ${sel ? "#99f6e4" : "transparent"}` }}>
                          <span style={{ fontSize: 11, color: sel ? "#0f766e" : "#475569", minWidth: 70, fontWeight: sel ? 500 : 400 }}>{v}</span>
                          <div style={{ flex: 1, height: 20, background: "#f1f3f5", borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${(val / max) * 100}%`, background: COLORS[i % COLORS.length], borderRadius: 4, transition: "width 0.3s" }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 500, color: sel ? "#0f766e" : "#475569", minWidth: 48, textAlign: "right" }}>{fmt(val)}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}

              {/* Dim2 chart */}
              {dim2Col && (
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#475569", marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
                    <span>{metricCol} by {dim2Col}</span>
                    <span style={{ fontWeight: 400, color: "#94a3b8", textTransform: "none", letterSpacing: 0 }}>click to filter</span>
                  </div>
                  {(() => {
                    const agg = aggBy(dim2Col, metricCol);
                    const allVals = uniqueVals(dim2Col);
                    const max = Math.max(...Object.values(agg), 1);
                    return allVals.map((v, i) => {
                      const val = agg[v] || 0;
                      const sel = filters.dim2 === v;
                      const dim = filters.dim2 && !sel;
                      return (
                        <div key={v} onClick={() => toggleFilter("dim2", v)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 6px", borderRadius: 6, cursor: "pointer", marginBottom: 4, opacity: dim ? 0.25 : 1, background: sel ? "#f0fdfa" : "transparent", border: `1.5px solid ${sel ? "#99f6e4" : "transparent"}` }}>
                          <span style={{ fontSize: 11, color: sel ? "#0f766e" : "#475569", minWidth: 70, fontWeight: sel ? 500 : 400 }}>{v}</span>
                          <div style={{ flex: 1, height: 20, background: "#f1f3f5", borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${(val / max) * 100}%`, background: COLORS[(i + 2) % COLORS.length], borderRadius: 4, transition: "width 0.3s" }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 500, color: sel ? "#0f766e" : "#475569", minWidth: 48, textAlign: "right" }}>{fmt(val)}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}

              {/* Dim3 chart */}
              {dim3Col && (
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#475569", marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
                    <span>{metricCol} by {dim3Col}</span>
                    <span style={{ fontWeight: 400, color: "#94a3b8", textTransform: "none", letterSpacing: 0 }}>click to filter</span>
                  </div>
                  {(() => {
                    const agg = aggBy(dim3Col, metricCol);
                    const allVals = uniqueVals(dim3Col);
                    const max = Math.max(...Object.values(agg), 1);
                    return allVals.map((v, i) => {
                      const val = agg[v] || 0;
                      const sel = filters.dim3 === v;
                      const dim = filters.dim3 && !sel;
                      return (
                        <div key={v} onClick={() => toggleFilter("dim3", v)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 6px", borderRadius: 6, cursor: "pointer", marginBottom: 4, opacity: dim ? 0.25 : 1, background: sel ? "#f0fdfa" : "transparent", border: `1.5px solid ${sel ? "#99f6e4" : "transparent"}` }}>
                          <span style={{ fontSize: 11, color: sel ? "#0f766e" : "#475569", minWidth: 70, fontWeight: sel ? 500 : 400 }}>{v}</span>
                          <div style={{ flex: 1, height: 20, background: "#f1f3f5", borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${(val / max) * 100}%`, background: COLORS[(i + 4) % COLORS.length], borderRadius: 4, transition: "width 0.3s" }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 500, color: sel ? "#0f766e" : "#475569", minWidth: 48, textAlign: "right" }}>{fmt(val)}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}

              {/* Summary table */}
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#475569", marginBottom: 12 }}>Data Preview</div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                    <thead>
                      <tr>{cols.map(c => <th key={c} style={{ padding: "5px 8px", textAlign: "left", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: "#94a3b8", borderBottom: "1px solid #e5e7eb", fontWeight: 500 }}>{c}</th>)}</tr>
                    </thead>
                    <tbody>
                      {filtered.slice(0, 8).map((row, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #f1f3f5" }}>
                          {cols.map(c => <td key={c} style={{ padding: "6px 8px", color: "#475569" }}>{typeof row[c] === "number" ? Number(row[c]).toLocaleString() : String(row[c])}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "chat" && (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 400 }}>
            <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", maxHeight: 480 }}>
              {chatMessages.length === 0 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 8, color: "#94a3b8", padding: 40 }}>
                  <div style={{ fontSize: 28 }}>💬</div>
                  <p style={{ fontSize: 13 }}>Ask anything about your data in plain English</p>
                  {["What is the total revenue?", "Which region performs best?", "Show me anomalies"].map(q => (
                    <span key={q} onClick={() => { setChatInput(q); }} style={{ fontSize: 11, padding: "4px 12px", borderRadius: 99, border: "1px solid #e5e7eb", cursor: "pointer", color: "#475569" }}>{q}</span>
                  ))}
                </div>
              )}
              {chatMessages.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: m.role === "ai" ? "#f0fdfa" : "#f1f3f5", border: `1px solid ${m.role === "ai" ? "#99f6e4" : "#e5e7eb"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600, flexShrink: 0, color: m.role === "ai" ? "#0f766e" : "#475569" }}>{m.role === "ai" ? "AI" : "U"}</div>
                  <div style={{ fontSize: 13, padding: "8px 12px", borderRadius: 8, maxWidth: "80%", lineHeight: 1.6, background: m.role === "ai" ? "#f8f9fa" : "#0d9488", color: m.role === "ai" ? "#0f172a" : "#fff", border: m.role === "ai" ? "1px solid #e5e7eb" : "none" }}>{m.text}</div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#f0fdfa", border: "1px solid #99f6e4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#0f766e", fontWeight: 600 }}>AI</div>
                  <div style={{ fontSize: 13, padding: "8px 12px", borderRadius: 8, background: "#f8f9fa", border: "1px solid #e5e7eb", color: "#94a3b8" }}>Thinking...</div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div style={{ borderTop: "1px solid #e5e7eb", padding: "10px 14px", display: "flex", gap: 8 }}>
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat()} placeholder="Ask anything about your data..." style={{ flex: 1, border: "1px solid #d1d5db", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontFamily: "inherit", outline: "none", color: "#0f172a" }} />
              <button onClick={sendChat} disabled={chatLoading} style={{ width: 36, height: 36, borderRadius: 8, background: "#0d9488", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
