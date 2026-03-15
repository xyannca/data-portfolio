import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <header className="page-header" style={{ padding: '30px 0', backgroundColor: '#f9f9f9', textAlign: 'justify' , fontFamily: 'Georgia, serif' }}>
        <h1>Data Visualization Portfolio</h1>
        <p style={{ color: '#666'}}>
          Strategic insights delivered through interactive BI solutions
          </p>
      </header>

      <div className="content-container" style={{ padding: '50px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
          
          {/* Project 1: Traffic Patterns */}
          <div className="project-card" style={{ border: '1px solid #eee', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <Image src="/traffic-patterns.png" alt="Traffic Patterns Analysis" width={400} height={250} layout="responsive" />
            <div style={{ padding: '20px' }}>
              <h3>Minnesota Traffic Patterns Analysis</h3>
              <p>
                A Tableau dashboard analyzing peak traffic volumes, congestion hotspots, and temporal patterns to support data-driven urban infrastructure planning.
              </p>
              <Link href="https://public.tableau.com/app/profile/ann.gu1154/viz/TrafficPatterns_17625561806190/Dashboard1" target="_blank" style={{ color: '#0070f3', fontWeight: 'bold' }}>View Live on Tableau Public</Link>
            </div>
          </div>

          {/* Project 2: NYC Cyclistic */}
          <div className="project-card" style={{ border: '1px solid #eee', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <Image src="/nyc-cyclistic.png" alt="NYC Cyclistic Bike Share" width={400} height={250} layout="responsive" />
            <div style={{ padding: '20px' }}>
              <h3>NYC Cyclistic Bike-Share Trends</h3>
              <p>Analyzing user behavior,trip duration patterns, and seasonal demand patterns for a large-scale bike-sharing program in New York City using Tableau.</p>
              <Link href="https://public.tableau.com/app/profile/ann.gu1154/viz/CyclistProject_17632679812200/Dashboard2" target="_blank" style={{ color: '#0070f3', fontWeight: 'bold' }}>View Live on Tableau Public</Link>
            </div>
          </div>

          {/* Project 3: Power BI Call Center */}
          <div className="project-card" style={{ border: '1px solid #eee', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <Image src="/powerbi-callcenter.png" alt="Call Center Performance Dashboard" width={400} height={250} layout="responsive" />
            <div style={{ padding: '20px' }}>
              <h3>Operational Call Center Intelligence</h3>
              <p>A Power BI solution tracking operational KPIs to support performance monitoring and workforce optimization.</p>
              <Link href="https://app.powerbi.com/view?r=eyJrIjoiY2YwNzY3ZDUtOTU2OC00NDg2LWJiMWItZjc5OGM5MTA4N2FkIiwidCI6ImE4OTE2ZTg1LTM4ZWYtNDMzOC1hMWMxLTIyMTU4NmY2MDMwNSJ9" target="_blank" style={{ color: '#0070f3', fontWeight: 'bold' }}>View Interactive Dashboard</Link>
            </div>
          </div>
        </div>

        {/* Return to Home Link at the bottom of the page */}
        <div style={{ marginTop: '60px', borderTop: '1px solid #eee', paddingTop: '20px', fontFamily: 'Georgia, serif' }}>
          <Link href="/" style={{ 
            display: 'inline-block',
            color: '#666', 
            marginTop: '60px',
            textDecoration: 'none' }}>

            ← Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}