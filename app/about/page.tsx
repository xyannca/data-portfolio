import Link from 'next/link';

export default function AboutPage() {
  return (
    <main style={{ 
      padding: '80px 5%', 
      fontFamily: 'Georgia, serif', 
      color: '#171717', 
      minHeight: '100vh',
      backgroundColor: '#fff' 
     
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '40px', fontWeight: 'bold' }}>About</h1>
        
        <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333', textAlign: 'justify' }}>
          <p style={{ marginBottom: '25px' }}>
            Bridging complex data architecture with human-centered insights.
          </p>
          <p style={{ marginBottom: '25px' }}>
            Strategic Data Leadership: With over a decade of experience at SAP, I have specialized in managing mission-critical reporting systems and ensuring enterprise data integrity within complex global architectures. 
            My focus is on transforming technical complexity into clear, actionable intelligence that supports decision-making.
          </p>
          <p style={{ marginBottom: '25px' }}>
           AI & Analytics Integration: Combining an MBA with a Postgraduate Diploma in AI to bridge the gap between technical potential and organizational goals. 
           Specializing in transforming raw data into strategic assets through intuitive dashboarding and intelligent automation to drive measurable efficiency.
          </p>
          
        

          {/* Strategic Data Solutions Section */}
          <div style={{ marginTop: '50px', padding: '30px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Technical Perspective</h2>
            <p style={{ marginBottom: '20px' }}>
              I offer deep expertise in SAP BI, Power BI, Tableau, big data platforms and AI automation. Whether you need to modernize legacy reporting or integrate predictive AI models into your existing workflow, I provide solution-focused strategies that drive business efficiency.
            </p>
            <Link href="/dashboard" style={{ color: '#171717', fontWeight: 'bold', textDecoration: 'underline' }}>
              Explore My Data Visualization Portfolio
            </Link>
          </div>
        </div>

        <Link href="/" style={{ 
          display: 'inline-block', 
          marginTop: '60px', 
          color: '#666', 
          textDecoration: 'none' 
        }}>
          ← Return to Home
        </Link>
      </div>
    </main>
  );
}