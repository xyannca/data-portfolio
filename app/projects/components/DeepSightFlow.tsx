"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { HelpCircle, Edit3, Database, Sparkles, Wand2, Layers, MessageCircle } from "lucide-react";

/**
 * DeepSightFlow
 * --------------
 * React Flow diagram of DeepSight's Zen/Chan questioning flow: the user's
 * reflection enters, is composed into a philosophically-framed prompt,
 * sent to Gemini, then routed through the Dissolve Experience before the
 * insight is rendered back — with the dialogue looping rather than ending.
 *
 * NOTE: node labels reflect what's publicly known about DeepSight (core
 * question, Next.js/Firebase/Gemini stack, Dissolve Experience feature).
 * Adjust labels/edges freely to match the real implementation.
 *
 * Integration notes:
 * - Requires `reactflow` (npm install reactflow) and `lucide-react`
 * - Ships its own CSS import (`reactflow/dist/style.css`) — safe to import
 *   once at the app root instead if you prefer
 */

const palette = {
  bg: "#12151C",
  panel: "#171B24",
  border: "#262C3A",
  textPrimary: "#E8EAED",
  textSecondary: "#8B93A7",
  textMuted: "#5B6274",
  cyan: "#5EEAD4",
  amber: "#F5A623",
  coral: "#F2836B",
  gray: "#4B5163",
};

const categoryStyle = {
  entry: { accent: palette.gray, Icon: HelpCircle },
  input: { accent: palette.cyan, Icon: Edit3 },
  storage: { accent: palette.gray, Icon: Database },
  api: { accent: palette.amber, Icon: Sparkles },
  signature: { accent: palette.coral, Icon: Wand2 },
  process: { accent: palette.cyan, Icon: Layers },
  output: { accent: palette.cyan, Icon: MessageCircle },
};

function FlowNode({ data }) {
  const { accent, Icon } = categoryStyle[data.category];
  return (
    <div
      style={{
        background: palette.panel,
        border: `1px solid ${accent}55`,
        borderLeft: `3px solid ${accent}`,
        minWidth: 180,
      }}
      className="rounded-md px-3 py-2.5 shadow-none"
    >
      <Handle type="target" position={Position.Top} style={{ background: accent, border: "none", width: 6, height: 6 }} />
      <div className="flex items-center gap-2">
        <Icon size={13} style={{ color: accent }} />
        <span style={{ color: palette.textPrimary }} className="text-xs font-medium">
          {data.label}
        </span>
      </div>
      {data.sub && (
        <span style={{ color: palette.textMuted }} className="text-[10px] block mt-1 leading-snug">
          {data.sub}
        </span>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: accent, border: "none", width: 6, height: 6 }} />
    </div>
  );
}

const nodeTypes = { flow: FlowNode };

const baseNodes = [
  { id: "entry", category: "entry", label: "Core question", sub: '"What blinds you from waking up?"', x: 260, y: 0 },
  { id: "input", category: "input", label: "Reflection input", sub: "user writes their question or block", x: 260, y: 100 },
  { id: "store", category: "storage", label: "Session log", sub: "Firebase — anonymized entry", x: 500, y: 100 },
  { id: "compose", category: "process", label: "Prompt composer", sub: "wraps input in Chan/Zen framing", x: 260, y: 200 },
  { id: "gemini", category: "api", label: "Gemini API", sub: "generates contemplative response", x: 260, y: 300 },
  { id: "dissolve", category: "signature", label: "Dissolve experience", sub: "response rendered as a dissolving form", x: 260, y: 400 },
  { id: "output", category: "output", label: "Insight surfaced", sub: "displayed back to the user", x: 260, y: 500 },
];

function toFlowNodes() {
  return baseNodes.map((n) => ({
    id: n.id,
    type: "flow",
    position: { x: n.x, y: n.y },
    data: { label: n.label, sub: n.sub, category: n.category },
  }));
}

function toFlowEdges() {
  const mk = (id, source, target, opts = {}) => ({
    id,
    source,
    target,
    type: "smoothstep",
    style: { stroke: palette.border, strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: palette.textMuted, width: 14, height: 14 },
    ...opts,
  });

  return [
    mk("e1", "entry", "input"),
    mk("e2", "input", "store", { style: { stroke: palette.border, strokeWidth: 1, strokeDasharray: "4 3" } }),
    mk("e3", "input", "compose"),
    mk("e4", "compose", "gemini"),
    mk("e5", "gemini", "dissolve"),
    mk("e6", "dissolve", "output"),
    mk("e7", "output", "input", {
      type: "smoothstep",
      sourceHandle: undefined,
      style: { stroke: palette.cyan, strokeWidth: 1.2, strokeDasharray: "3 3" },
      markerEnd: { type: MarkerType.ArrowClosed, color: palette.cyan, width: 12, height: 12 },
      label: "continues the dialogue",
      labelStyle: { fill: palette.textMuted, fontSize: 10 },
      labelBgStyle: { fill: palette.bg },
    }),
  ];
}

export default function DeepSightFlow() {
  const nodes = useMemo(() => toFlowNodes(), []);
  const edges = useMemo(() => toFlowEdges(), []);

  return (
    <div style={{ background: palette.bg }} className="w-full rounded-xl p-5 md:p-6">
      <div className="mb-4">
        <h2 style={{ color: palette.textPrimary }} className="text-lg font-medium">
          DeepSight — questioning flow
        </h2>
        <p style={{ color: palette.textMuted }} className="text-xs mt-0.5">
          How a reflection moves from the core question to a dissolving insight
        </p>
      </div>

      <div style={{ height: 620, background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 12 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={true}
          nodesConnectable={false}
          panOnScroll
          zoomOnScroll={false}
        >
          <Background color={palette.border} gap={20} size={1} />
          <Controls
            showInteractive={false}
            style={{ button: { background: palette.panel, color: palette.textPrimary, border: `1px solid ${palette.border}` } }}
          />
        </ReactFlow>
      </div>

      <div className="flex flex-wrap gap-4 mt-3">
        {Object.entries({
          "user input": palette.cyan,
          "external / api": palette.amber,
          "signature feature": palette.coral,
          "structural / storage": palette.gray,
        }).map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5">
            <span style={{ background: color }} className="w-2 h-2 rounded-sm inline-block" />
            <span style={{ color: palette.textMuted }} className="text-[11px]">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
