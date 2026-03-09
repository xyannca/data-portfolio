import Link from 'next/link';

export default function AIProjectsPage() {
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
          <h1 style={{ fontSize: '2.0rem', color: '#1a1a1a', marginBottom: '40px' }}>AI Projects</h1>
          <p style={{ fontSize: '1.5rem', color: '#666', fontWeight: '300', maxWidth: '800px', margin: '0 auto', textAlign: 'justify'}}>
            AI systems designed for insight, automation, and deeper understanding
          </p>
        </div>
      </header>

      {/* Lower Section: White Background */}
      <section style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '40px' 
        }}>
          
          {/* Card 1: deep sight */}
          <div style={{ 
            padding: '50px', 
            borderRadius: '30px', 
            border: '1px solid #f0f0f0',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🍀</div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '15px' }}>DeepSight</h2>
            <p style={{ color: '#555', lineHeight: '1.7', fontSize: '1.1rem', marginBottom: '30px' }}>
              The intersection of Zen and AI. Direct to the truth through psychological awareness and reflection.
            </p>
            <Link href="/deep-sight" style={{ color: '#0066cc', fontWeight: '600', textDecoration: 'none', borderBottom: '2px solid #0066cc' }}>
              Enter Portal →
            </Link>
          </div>

          {/* Card 2: Career Intelligence Engine */}
          <div style={{ 
            padding: '50px', 
            borderRadius: '30px', 
            border: '1px solid #f0f0f0',
            backgroundColor: '#ffffff',
            opacity: 0.7
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🤖</div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '15px', color: '#999' }}>Autonomous Insight Engine</h2>
            <p style={{ color: '#888', lineHeight: '1.7', fontSize: '1.1rem', marginBottom: '30px' }}>
              Python, Streamlit, LLM Prompt Engineering, Automated ETL
            </p>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#ccc', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Coming Soon
            </span>
          </div>

        </div>
      </section>
    </main>
  );
}