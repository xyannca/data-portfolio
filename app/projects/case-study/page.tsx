"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Sliders, Sparkles, Gauge, CheckCircle2 } from "lucide-react";

// Single shared accent — same teal used for DeepSight's tagline and Projects
// card elsewhere on the site. Steps no longer carry their own hue; only
// content differs between them now.
const ACCENT = "#14b8a6";
const ACCENT_DARK = "#0f766e";
const ACCENT_SOFT_BG = "#f0fdfa";
const ACCENT_SOFT_BADGE_BG = "#ccfbf1";
// Lighter, thinner border for the active circle — the full-strength ACCENT
// read as too bold/dark against the page's muted palette.
const ACCENT_BORDER_SOFT = "#5eead4";

type Step = {
  title: string;
  badge: string;
  icon: typeof FileText;
  detailTitle: string;
  detailText: string;
};

const steps: Step[] = [
  {
    title: "01 Input",
    badge: "HTTP POST",
    icon: FileText,
    detailTitle: "01 · INPUT PROCESSING",
    detailText:
      "A user submits free-form reflection text through the chat interface or API endpoint. The payload is validated and structured for processing.",
  },
  {
    title: "02 Prompt",
    badge: "GROUNDING",
    icon: Sliders,
    detailTitle: "02 · PROMPT COMPOSITION",
    detailText:
      "Assembles a mode-specific system prompt with strict content-grounding rules and language matching to prevent hallucinated insights.",
  },
  {
    title: "03 Reasoning",
    badge: "JSON MODE",
    icon: Sparkles,
    detailTitle: "03 · REASONING & EXTRACTION",
    detailText:
      "Requests structured JSON-mode output from the Gemini API; unparseable or non-compliant responses are automatically rejected.",
  },
  {
    title: "04 Usage",
    badge: "RATE LIMIT",
    icon: Gauge,
    detailTitle: "04 · USAGE CONTROL",
    detailText:
      "Firestore tracks per-user rate limits and daily quotas, keyed securely by an anonymous UID to maintain service availability.",
  },
];

const AUTOPLAY_MS = 3200;

export default function CaseStudyPage() {
  const [current, setCurrent] = useState(0);
  const [autoPlaying, setAutoPlaying] = useState(true);

  useEffect(() => {
    if (!autoPlaying) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % steps.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [autoPlaying]);

  const active = steps[current];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .ob-launch-deepsight-link {
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .ob-launch-deepsight-link:hover {
          color: #0f766e;
          transform: translateX(2px);
        }
      `}</style>

      <main
        style={{
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          color: '#0f172a',
          fontFamily: "'Inter', sans-serif",
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px',  marginTop: '80px'}}>
            <h1 style={{
              fontFamily: "'Georgia', serif",
              fontSize: '2rem',
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '0.01rem',
              margin: '0 0 20px',
            }}>
              How DeepSight works
            </h1>
            <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: 500, margin: '0 auto' }}>
              A technical walkthrough of the unstructured data processing pipeline
            </p>
          </div>

          {/* Circular steps — auto-fit grid: 4 across on desktop, wraps
              gracefully on narrower screens, all without relying on
              Tailwind breakpoint utilities. */}
          <div
            onMouseEnter={() => setAutoPlaying(false)}
            onMouseLeave={() => setAutoPlaying(true)}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '56px',
              maxWidth: '820px',
              margin: '0 auto 40px',
            }}
          >
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === current;
              return (
                <div
                  key={step.title}
                  onClick={() => setCurrent(i)}
                  style={{
                    cursor: 'pointer',
                    width: '150px',
                    height: '150px',
                    margin: '0 auto',
                    borderRadius: '50%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    // No glow — a quiet border/background shift is enough to
                    // mark the active step, matching the site's restrained tone.
                    boxShadow: 'none',
                    opacity: isActive ? 1 : 0.6,
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: ACCENT_SOFT_BADGE_BG,
                    color: ACCENT_DARK,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px',
                  }}>
                    <Icon size={16} />
                  </div>
                  <h3 style={{
                    fontFamily: "'Georgia', serif",
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#0f172a',
                    margin: '0 0 8px',
                  }}>
                    {step.title}
                  </h3>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.3px',
                    backgroundColor: isActive ? ACCENT_SOFT_BADGE_BG : '#f1f5f9',
                    color: isActive ? ACCENT_DARK : '#94a3b8',
                    border: `1px solid ${isActive ? ACCENT_BORDER_SOFT : 'transparent'}`,
                  }}>
                    {step.badge}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Detail card — single shared teal accent, not per-step */}
          <div style={{
            backgroundColor: '#ffffff',
            
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
            transition: 'all 0.3s ease',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '14px',
              marginBottom: '14px',
            }}>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#14b8a6'
              }}>
                <CheckCircle2 size={16} color="#94a3b8" />
                {active.detailTitle}
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#94a3b8',
              }}>
                STEP {current + 1} OF {steps.length}
              </span>
            </div>
            <p style={{ color: '#334155', fontSize: '0.8rem', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
              {active.detailText}
            </p>

            {/* Persistent footer — same on every step, not tied to which
                step is active. Internal link (this app IS the deep-sight
                route), so next/link rather than an external <a>. */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              borderTop: '1px solid #f1f5f9',
              marginTop: '20px',
              paddingTop: '20px',
            }}>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '10px',
                color: '#94a3b8',
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#94a3b8',
                  display: 'inline-block',
                }} />
                DeepSight Pipeline Engine · Standalone R&D Instance
              </span>

              <Link
                href="/deep-sight"
                className="ob-launch-deepsight-link"
                style={{
                  display: 'inline-block',
                  color: '#14b8a6',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  textDecoration: 'none',
                }}
              >
                Launch Live DeepSight →
              </Link>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
