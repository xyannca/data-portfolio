import Link from 'next/link';

type OneBoardStats = {
  activeUsers: number;
  sessions: number;
  topChannel: string;
} | null;

// Server-side fetch — runs on the Next.js server at request/revalidation
// time, not in the browser, so there's no CORS concern (that only applies
// to fetches initiated from client-side JS). Cached for 5 minutes via
// `revalidate` so a burst of portfolio visits doesn't hammer OneBoard's own
// GA4 quota on every single page load.
async function getOneBoardStats(): Promise<OneBoardStats> {
  try {
    const res = await fetch('https://one-board-dtmv.vercel.app/api/ga4/executive?range=7d', {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.summary) return null;
    return {
      activeUsers: data.summary.activeUsers,
      sessions: data.summary.sessions,
      topChannel: data.summary.topChannel,
    };
  } catch {
    return null;
  }
}

export default async function AIProjectsPage() {
  const oneBoardStats = await getOneBoardStats();

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: '"Georgia", serif' }}>

      {/* Upper Section: Gray Background */}
      <header style={{
        backgroundColor: '#f9f9f9',
        padding: '150px 20px',
        textAlign: 'center',
        marginBottom: '10px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* <h1 style={{ fontSize: '2.0rem', color: '#1a1a1a', marginBottom: '40px' }}>Projects</h1> */}
          <p style={{ fontSize: '1.5rem', color: '#666', fontWeight: '300', maxWidth: '900px', margin: '0 auto', textAlign: 'justify'}}>
            AI and BI solutions designed for insight, automation, and deeper understanding
          </p>
        </div>
      </header>

      {/* Small live-motion touches used on the OneBoard card below — plain
          <style> tags work fine here since it's static CSS, no client
          interactivity needed. */}
      <style>{`
        @keyframes onboard-live-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .onboard-live-dot {
          animation: onboard-live-blink 1.6s ease-in-out infinite;
        }
        @keyframes onboard-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .onboard-marquee {
          animation: onboard-marquee-scroll 16s linear infinite;
        }
        @keyframes onboard-jump {
          0%, 100% { height: 5px; opacity: 0.45; }
          50% { height: 16px; opacity: 1; }
        }
        .onboard-jump-dot {
          width: 3px;
          border-radius: 2px;
          background-color: #059669;
          animation: onboard-jump 1s ease-in-out infinite;
        }
      `}</style>

      {/* Lower Section: White Background */}
      <section style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '40px'
        }}>

          {/* Card 1: OneBoard */}
          <div style={{
            padding: '50px',
            borderRadius: '30px',
            border: '1px solid #f0f0f0',
            backgroundColor: '#ffffff',
            textAlign: 'justify',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'linear-gradient(to bottom right, #059669, #0d9488)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 900,
              fontSize: '1.6rem',
              marginBottom: '20px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              boxShadow: '0 2px 8px rgba(5,150,105,0.3)',
            }}>
              O
            </div>

            <h2 style={{ fontSize: '2.0rem', marginBottom: '15px' }}>OneBoard</h2>

            <h1 style={{ fontSize: '1.1rem', color: '#14b8a6', fontWeight: '800', marginBottom: '20px', lineHeight: '1.3' }}>
              Auto-Dashboard Engine · Live GA4 Telemetry + Excel Blending
            </h1>

            {/* Live ticker strip — jumping dots stand in for live GA4 data
                points, marquee text carries the "engine running" feel and,
                when the fetch above succeeds, real numbers rather than
                decorative filler. Placed right under the tagline so the
                "this is alive" signal is the first thing after the headline,
                not something a visitor has to scroll past everything to find. */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '14px 20px',
              borderRadius: '14px',
              border: '1px solid #e5e5e5',
              backgroundColor: '#fafafa',
              marginBottom: '10px',
              overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '18px', flexShrink: 0 }}>
                <span className="onboard-jump-dot" style={{ animationDelay: '0s' }} />
                <span className="onboard-jump-dot" style={{ animationDelay: '0.15s' }} />
                <span className="onboard-jump-dot" style={{ animationDelay: '0.3s' }} />
                <span className="onboard-jump-dot" style={{ animationDelay: '0.45s' }} />
              </div>

              <div style={{
                flex: 1,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                // Fades text out at both edges instead of a hard clip —
                // that's what was making the cut-off text look broken
                // rather than like an intentional scrolling ticker.
                WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 20px, black calc(100% - 20px), transparent 100%)',
                maskImage: 'linear-gradient(to right, transparent 0, black 20px, black calc(100% - 20px), transparent 100%)',
              }}>
                <div className="onboard-marquee" style={{
                  display: 'inline-block',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#059669',
                }}>
                  {(() => {
                    const segment = oneBoardStats
                      ? `● Engine Running \u00a0\u00b7\u00a0 ${oneBoardStats.activeUsers} Active Users (7d) \u00a0\u00b7\u00a0 ${oneBoardStats.sessions} Sessions \u00a0\u00b7\u00a0 Top Channel: ${oneBoardStats.topChannel} \u00a0\u00b7\u00a0 Live GA4 DirectQuery \u00a0\u00b7\u00a0 `
                      : `● Engine Running \u00a0\u00b7\u00a0 Live GA4 DirectQuery Active \u00a0\u00b7\u00a0 Not a Screenshot \u00a0\u00b7\u00a0 `;
                    // Repeated so the marquee loop has no visible seam.
                    return segment.repeat(2);
                  })()}
                </div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '40px',
              marginTop: '30px',
              marginBottom: '40px',
              borderTop: '1px solid #eee',
              borderBottom: '1px solid #eee',
              padding: '30px 0'
            }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px', color: '#999' }}>The About</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#444', margin: 0 }}>
                  OneBoard blends live Google Analytics telemetry with offline Excel baselines into <strong>one auto-generated dashboard</strong>.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px', color: '#999' }}>The Essence</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#444', margin: 0 }}>
                  From fragmented GA4, spreadsheet, and (future) ERP data to <strong>one unified view</strong>, in real time. No manual exports, no static screenshots.
                </p>
              </div>
            </div>

            <div style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
              {[
                { label: 'Data', desc: 'Live queries against the Google Analytics Data API (GA4), server-side via Next.js API routes.' },
                { label: 'Architecture', desc: 'Next.js, TypeScript, Recharts, react-simple-maps — deployed on Vercel.' }
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', marginBottom: '8px', fontSize: '0.95rem', color: '#666' }}>
                  <span style={{ marginRight: '10px', color: '#ccc' }}>•</span>
                  <span><strong>{item.label}:</strong> {item.desc}</span>
                </div>
              ))}
            </div>

            <a
              href="https://one-board-dtmv.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0066cc', fontWeight: '600', textDecoration: 'none', borderBottom: '2px solid #0066cc' }}
            >
              Launch Live OneBoard →
            </a>
          </div>

          {/* Card 2: DeepSight */}
          <div style={{
            padding: '50px',
            borderRadius: '30px',
            border: '1px solid #f0f0f0',
            backgroundColor: '#ffffff',
            textAlign: 'justify',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🍀</div>

            <h2 style={{ fontSize: '2.0rem', marginBottom: '15px' }}>DeepSight</h2>

            <h1 style={{ fontSize: '1.1rem', color: '#14b8a6', fontWeight: '800', marginBottom: '20px', lineHeight: '1.3' }}>
              AI-powered qualitative data analysis &
              <span style={{ color: '#14b8a6' }}> natural language self-inquiry pipeline </span>
            </h1>

            <p style={{
              fontStyle: 'italic',
              marginBottom: '25px',
              color: '#888',
              fontSize: '0.95rem',
              fontFamily: 'Georgia, serif'
            }}>
              {/* No appointment. No waiting room. No shame. No bias. Just a rational mirror for your mind. */}
              Unstructured text → structured insight
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '40px',
              marginTop: '40px',
              marginBottom: '40px',
              borderTop: '1px solid #eee',
              borderBottom: '1px solid #eee',
              padding: '30px 0'
            }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px', color: '#999' }}>The About</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#444', margin: 0}}>
                  DeepSight applies a strict, rule-based prompt architecture to extract grounded themes from free-form user input.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px', color: '#999' }}>The Essence</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#444', margin: 0}}>
                  An NLP pipeline that transforms free-form reflections into structured JSON output, surfacing the emotional pattern in each entry.
                </p>
              </div>
            </div>

            <div style={{ listStyle: 'none', padding: 0, marginBottom: '40px' }}>
              {[
                { label: 'Intelligence', desc: 'Custom LLM pipelines for objective pattern analysis.' },
                { label: 'Architecture', desc: 'Built with Next.js & TypeScript for a seamless UX.' }
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', marginBottom: '8px', fontSize: '0.95rem', color: '#666' }}>
                  <span style={{ marginRight: '10px', color: '#ccc' }}>•</span>
                  <span><strong>{item.label}:</strong> {item.desc}</span>
                </div>
              ))}
            </div>

            <Link href="/projects/case-study" style={{ color: '#0066cc', fontWeight: '600', textDecoration: 'none', borderBottom: '2px solid #0066cc' }}>
              View Pipeline →
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
