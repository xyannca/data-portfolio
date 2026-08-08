"use client";

import { useState, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Play, Loader2, CheckCircle2, Circle, ArrowRight } from "lucide-react";

/**
 * PromptPipelineSandbox
 * ----------------------
 * Left: prompt input. Right: pipeline steps animate in sequence, then the
 * final output renders as syntax-highlighted JSON. Meant to sit inside the
 * same dark "AI Project" section as AIProjectDashboard — shares its palette.
 *
 * Integration notes:
 * - Requires `react-syntax-highlighter` (npm install react-syntax-highlighter)
 * - Requires `lucide-react` (npm install lucide-react)
 * - Swap `runPipeline()` for a real API call once wired to a live backend —
 *   it currently simulates staged latency so the step animation has
 *   something to show.
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
};

const STAGES = [
  { key: "parse", label: "Parse prompt", ms: 420 },
  { key: "retrieve", label: "Retrieve context", ms: 680 },
  { key: "embed", label: "Embed + rank", ms: 520 },
  { key: "generate", label: "Generate response", ms: 900 },
];

function buildOutput(prompt) {
  return JSON.stringify(
    {
      status: "ok",
      model: "claude-sonnet",
      input_tokens: Math.max(8, Math.round(prompt.length / 4)),
      output_tokens: 64,
      latency_ms: 2520,
      response: prompt.trim()
        ? `Summary generated for: "${prompt.trim().slice(0, 48)}${prompt.trim().length > 48 ? "…" : ""}"`
        : "No prompt provided.",
    },
    null,
    2
  );
}

function StepIndicator({ stage, state }) {
  // state: 'pending' | 'active' | 'done'
  const color = state === "done" ? palette.cyan : state === "active" ? palette.amber : palette.textMuted;
  return (
    <div className="flex items-center gap-2.5 py-2">
      {state === "active" ? (
        <Loader2 size={14} className="animate-spin" style={{ color }} />
      ) : state === "done" ? (
        <CheckCircle2 size={14} style={{ color }} />
      ) : (
        <Circle size={14} style={{ color }} />
      )}
      <span style={{ color: state === "pending" ? palette.textMuted : palette.textPrimary }} className="text-sm">
        {stage.label}
      </span>
    </div>
  );
}

export default function PromptPipelineSandbox() {
  const [prompt, setPrompt] = useState("Summarize the key risks in this quarter's supplier report.");
  const [stageIndex, setStageIndex] = useState(-1); // -1 = idle, STAGES.length = complete
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const timeouts = useRef([]);

  const runPipeline = () => {
    if (running) return;
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setOutput(null);
    setRunning(true);
    setStageIndex(0);

    let elapsed = 0;
    STAGES.forEach((stage, i) => {
      elapsed += stage.ms;
      const id = setTimeout(() => {
        setStageIndex(i + 1);
        if (i === STAGES.length - 1) {
          setOutput(buildOutput(prompt));
          setRunning(false);
        }
      }, elapsed);
      timeouts.current.push(id);
    });
  };

  return (
    <div style={{ background: palette.bg }} className="w-full rounded-xl p-5 md:p-6">
      <div className="mb-5">
        <h2 style={{ color: palette.textPrimary }} className="text-lg font-medium">
          Prompt pipeline sandbox
        </h2>
        <p style={{ color: palette.textMuted }} className="text-xs mt-0.5">
          Watch a prompt move through parsing, retrieval, and generation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: prompt input */}
        <div
          style={{ background: palette.panel, border: `1px solid ${palette.border}` }}
          className="rounded-lg p-4 flex flex-col"
        >
          <span style={{ color: palette.textSecondary }} className="text-xs tracking-wide uppercase mb-2">
            Prompt
          </span>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={8}
            style={{
              background: palette.panelAlt,
              border: `1px solid ${palette.border}`,
              color: palette.textPrimary,
            }}
            className="w-full rounded-md p-3 text-sm resize-none outline-none focus:border-transparent"
            placeholder="Type a prompt to run through the pipeline…"
          />
          <button
            onClick={runPipeline}
            disabled={running}
            style={{
              background: running ? palette.panelAlt : palette.cyan,
              color: running ? palette.textMuted : "#04342C",
            }}
            className="mt-3 self-start flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-opacity disabled:cursor-not-allowed"
          >
            {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            {running ? "Running…" : "Run pipeline"}
          </button>
        </div>

        {/* Right: steps + output */}
        <div
          style={{ background: palette.panel, border: `1px solid ${palette.border}` }}
          className="rounded-lg p-4 flex flex-col"
        >
          <span style={{ color: palette.textSecondary }} className="text-xs tracking-wide uppercase mb-1">
            Pipeline steps
          </span>
          <div>
            {STAGES.map((stage, i) => (
              <StepIndicator
                key={stage.key}
                stage={stage}
                state={stageIndex > i ? "done" : stageIndex === i ? "active" : "pending"}
              />
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${palette.border}` }} className="mt-2 pt-3 flex-1 flex flex-col">
            <div className="flex items-center gap-1.5 mb-2">
              <ArrowRight size={12} style={{ color: palette.textMuted }} />
              <span style={{ color: palette.textSecondary }} className="text-xs tracking-wide uppercase">
                Output
              </span>
            </div>
            {output ? (
              <div className="rounded-md overflow-hidden text-xs">
                <SyntaxHighlighter
                  language="json"
                  style={oneDark}
                  customStyle={{ margin: 0, background: palette.panelAlt, fontSize: 12, padding: 12 }}
                >
                  {output}
                </SyntaxHighlighter>
              </div>
            ) : (
              <div
                style={{ color: palette.textMuted, border: `1px dashed ${palette.border}` }}
                className="flex-1 rounded-md flex items-center justify-center text-xs py-6"
              >
                {running ? "Waiting for pipeline to finish…" : "Run the pipeline to see output here"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
