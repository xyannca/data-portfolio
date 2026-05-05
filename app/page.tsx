// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      {/* 1. Hero Section */}
      <section className="hero">  
          <div className="hero-text">
            <h1>Data Analyst | AI Automation | Human Insights</h1>
            <p>
              Transforming data into insights through analytics, AI, and human-centered thinking
            </p>
          </div>
      </section>



      {/* 3. The Three Pillars Section */}
        <section style={{ 
          padding: '60px 5%', 
          backgroundColor: '#f9f9f9', /* Subtle background shift to define the section */
          textAlign: 'center' 
        }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '50px' }}>Core Focus</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '40px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Pillar 1: dashboard */}
            <div style={{ padding: '30px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📊</div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '15px' }}>Dashboard</h3>
              
              <Link href="/dashboard" style={{ fontWeight: 'bold', color: '#171717', textDecoration: 'underline' }}>Explore Dashboard</Link>
            </div>
 
            {/* Pillar 2: AI-Driven Automation */}
            <div style={{ padding: '30px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🤖</div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '15px' }}>AI-Driven Automation</h3>
              
              <Link href="/deep-sight" style={{ fontWeight: 'bold', color: '#171717', textDecoration: 'underline' }}>Explore Deep Sight</Link>
            </div>

            {/* Pillar 3: Video Meditations */}
            <div style={{ padding: '30px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🧩</div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '15px' }}>Human-Centered Insights</h3>  
              <p style={{ color: '#171717', lineHeight: '1.6',  fontWeight: 'bold', marginBottom: '20px' }}>
                Human Behavior and Awareness
              </p>

            </div>
          </div>
        </section>

        

     {/* 2. Structured Content Area - 1st article session */}
      <div className='articles-section' style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '60px' }}>
      
      {/* 1. Professional Philosophy  */}
      <div className="article-container" style={{ 
        display: 'flex', 
        gap: '40px', 
        alignItems: 'center',  
        paddingBottom: '60px',
        flexWrap: 'wrap' 
      }}>
        
        {/* article*/}
        <div className="article-text" style={{ flex: '1.5', minWidth: '300px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '25px' }}>Professional Philosophy</h3>
          
          <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1rem', color: '#333', lineHeight: '1.8', textAlign: 'justify' }}>
            <p style={{ marginBottom: '30px' }}>
              In the high-stakes environment of enterprise data architecture, the noise of overwhelming datasets and emotional reactivity often clouds critical judgment.
            </p>
            
            <p style={{ marginBottom: '30px' }}>
              Strategic insight emerges through a state of presence, allowing for a step back from the data 'tsunami' to observe the current data landscape without distortion. 
              In this stillness, patterns and trends surface naturally, revealing the fundamental logic and the most efficient path forward.
            </p>
            
            {/* emphasis*/}
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#171717', 
              fontWeight: 'bold', 
              borderLeft: '3px solid #14b8a6', 
              paddingLeft: '20px',
              marginTop: '40px'
            }}>
              "Strategic wisdom emerges from clarity and presence"
            </p>
          </div>
        </div>

        {/* 2. The Image Part (Now Second) */}
          <div className="article-image"> {/* Increased width to use more of the available space */}
            <img 
              src="/sky.jpg" 
              alt="Strategic Clarity" 
              style={{ width: '240px',
                height: '240px',
                marginLeft: 'auto',
                borderRadius: '50%',
                objectFit: 'cover',
                opacity: 0.95,
                boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }} 
              />
            </div>
        

        {/* 3. Behavioral Insights Section Wrapper */}
        <div style={{ 
          paddingBottom: '60px', 
          width: '100%', 
          maxWidth: '1200px', // Matches your Philosophy section width
          marginLeft: 'auto', 
          marginRight: '0' 
        }}>
          
          {/* The Title sits above the grid, so it doesn't mess with the columns */}
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '30px' }}>
            Behavioral Insights
          </h3>
          
          {/* Simple 2-column grid for the text */}
          <div className="behavioral-grid" style={{ 
            fontFamily: 'Georgia, serif', 
            fontStyle: 'italic' 
          }}>
            
            {/* Watching Fear Column */}
            <div>
              <p style={{ color: '#14b8a6', marginBottom: '10px' }}>Watching Fear</p>
              <p style={{ lineHeight: '1.8', color: '#333' }}>
                Fear cannot exist where there is no attachment to it.
              </p>
            </div>

            {/* The Observer Column */}
            <div>
              <p style={{ color: '#14b8a6', marginBottom: '10px' }}>The Observer</p>
              <p style={{ lineHeight: '1.8', color: '#333' }}>
                Awareness allows a strategic analyst to view their own hypotheses from an objective, outsider’s perspective.
              </p>
            </div>        
          </div>
        </div>

      </div>
    </div>


      {/* Video Section; Increase space before the Video Section */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '60px', marginBottom: '30px', marginLeft: '0%' }}>Natural Resonance</h2>
        
        {/* Video Container - Side-by-Side Layout */}
        {/* Corrected Side-by-Side Video Container */}
        <div style={{ 
          width: '100%', 
          maxWidth: '500px', 
          
          backgroundColor: '#f5f5f5',
          borderRadius: '15px', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#999',
          marginBottom: '15px', /* Adds significant space before the footer */
          /*boxShadow: '0 4px 20px rgba(0,0,0,0.05)'  Optional: Adds a soft depth */
        }}>


         <video 
          width="100%" 
          height="auto" 
          autoPlay  // Starts automatically
          loop      // Restarts the 7 seconds instantly
          muted     // Keeps the rain sound silent for peace
          playsInline // Prevents jumping to full-screen on mobile
          controls  // Allows user controls 
          style={{ display: 'block', borderRadius: '12px' }}
        >
          <source src="/peaceful_reading.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        </div>

         {/* Turquoise Phrase Added Here */}
          <p style={{ 
            color: '#14b8a6', // Changed to match your branding
            fontStyle: 'italic', // Keeps the original italic style for contrast
            fontFamily: 'Georgia, serif', // Maintains the serif font for a classic feel
         
            lineHeight: '1.8',
            fontSize: '1.1rem' 
          }}>
            Immersion in the quiet pulse of nature
          </p>

      </div>
      
   <footer style={{ padding: '30px 5%', borderTop: '1px solid #eee', marginTop: '100px', fontFamily: 'Georgia, serif' }}>
       
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
          
          {/* Column 1: Professional Summary */}
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Data Portfolio Summary</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.6'}}>
              Bridging complex data architecture with human-centered insights.
              Leveraging AI automation and behavioral frameworks to reveal the fundamental logic beneath the noise.
            </p>
          </div>

          {/* Column 2: Professional Links */}
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Connect</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><a href="mailto:xyannca@gmail.com">Email Me</a></li>
              <li style={{ marginTop: '10px' }}>
                <a 
                  href="https://www.linkedin.com/in/anne-g-ba3b5322" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-teal-600 transition-colors cursor-pointer"
                >
                  LinkedIn
                </a>
              </li>
              
            </ul>
          </div>

          {/* Column 3: Site Links */}
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Projects</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              
              <li><Link href="/deep-sight" style={{ color: '#666', textDecoration: 'none' }}>AI Deep Sight Project</Link></li>
              <li><a href="https://github.com/xyannca"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-600 transition-colors cursor-pointer"
              >GitHub Portfolio</a></li>
            </ul>

          </div>
        </div>

         {/* New Full-Width Bottom Section */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid #eee',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline', //This is the fix
              gap: '8px',
              fontSize: '0.8rem',
              color: '#999',
              lineHeight: '1',
            }}
          >
        <div className="footer-row">
            <span>© 2026 Anne Gu. All rights reserved.</span>
            <span>{' • '}</span>
            <Link
              href="/privacy"
              style={{
                color: '#999',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                lineHeight: '1',
                fontSize: '0.7rem'
              }}
            >Privacy Policy</Link>

         </div>

        </div>
      </div>
      

      </footer>

    </main>
  );
}