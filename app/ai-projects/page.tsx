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
            textAlign: 'justify',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
           
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🍀</div>
            
            <h2 style={{ fontSize: '2.0rem', marginBottom: '15px' }}>DeepSight</h2>

            <h1 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px', lineHeight: '1.3' }}>
              A non-judgmental mirror 
              <span style={{ color: '#0066cc' }}> for your own mind.</span>
            </h1>
            
            {/*  */}
            <p style={{ 
              fontStyle: 'italic', 
              marginBottom: '25px', 
              color: '#888', 
              fontSize: '0.9rem',
              fontFamily: 'Georgia, serif' 
            }}>
              No appointment. No waiting room. No shame. No bias. Just a rational mirror for your mind.
            </p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '40px', 
              marginTop: '40px', 
              marginBottom: '40px',
              borderTop: '1px solid #eee', 
              borderBottom: '1px solid #eee',
              padding: '30px 0'
            }}>
              
              {/* The About */}
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px', color: '#999' }}>The About</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#444', margin: 0 }}>
                  Over <strong>50%</strong> of people never seek help due to <strong>fear of being judged</strong>. DeepSight removes this barrier with total privacy and clinical depth.
                </p>
              </div>

              {/* The Experience */}
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px', color: '#999' }}>The Essence</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#444', margin: 0 }}>
                  An <strong>inner inquiry engine</strong> designed to reflect recursive mental patterns. It transforms AI into a silent, rational observer.
                </p>
              </div>
            </div>

            {/* tech */}
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
            <h2 style={{ fontSize: '2.0rem', marginBottom: '15px', color: '#999' }}>Autonomous Insight Engine</h2>
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