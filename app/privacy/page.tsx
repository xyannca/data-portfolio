import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main style={{ 
      padding: '80px 5%', 
      fontFamily: 'Georgia, serif', 
      color: '#171717', 
      minHeight: '100vh',
      backgroundColor: '#fff' 
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '40px', fontWeight: 'bold' }}>Privacy</h1>
        
        <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333', textAlign: 'justify'}}>
          <p style={{ marginBottom: '25px' }}>
            This Privacy Policy explains how information is handled on this website.
          </p>

          <p style={{ marginBottom: '25px' }}>
            This website is a personal data analytics portfolio created to showcase projects, skills, and professional experience.
          </p>

          <p style={{ marginBottom: '25px' }}>
            This site does not knowingly collect personal data from visitors. No contact forms, user accounts, or subscriptions are required to access the content.
          </p>

          <p style={{ marginBottom: '25px' }}>
            Basic, anonymous analytics may be used to understand overall site usage for the purpose of improving site performance and content presentation.
            No personally identifiable information is collected through analytics.
          </p>

          <p style={{ marginBottom: '25px' }}>
            This site does not use advertising cookies or marketing trackers.
            Any analytics tools used operate in compliance with standard privacy practices and collect aggregated, non-identifiable data only.
          </p>

          <p style={{ marginBottom: '25px' }}>
            This site contains links to external platforms (such as GitHub or Tableau Public).
            Once you leave this site, this Privacy Policy no longer applies, and you should review the privacy policies of those platforms.
          </p>

          <p style={{ marginBottom: '25px' }}>
            This privacy policy may be updated periodically to reflect changes to the site.
          </p>
          <p style={{ marginTop: '40px', color: '#999', fontSize: '0.9rem' }}>
            Last updated: 2026
          </p>
        </div>

        {/* Standard Return Link */}
        <Link href="/" style={{ 
          display: 'inline-block', 
          marginTop: '60px', 
          color: '#666', 
          textDecoration: 'none',
          fontSize: '1rem' 
        }}>
          ← Return to Home
        </Link>
      </div>
    </main>
  );
}