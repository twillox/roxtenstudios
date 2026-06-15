export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#000', color: '#fff', borderTop: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ padding: '8vw 5vw', display: 'flex', flexWrap: 'wrap', gap: '4rem', justifyContent: 'space-between' }}>
        
        {/* Navigation */}
        <div style={{ display: 'flex', gap: 'clamp(2rem, 8vw, 6rem)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <span style={{ opacity: 0.4, marginBottom: '1rem' }}>Studio</span>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', opacity: 0.8 }}>About</a>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', opacity: 0.8 }}>Selected Works</a>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', opacity: 0.8 }}>Philosophy</a>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', opacity: 0.8 }}>Careers</a>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <span style={{ opacity: 0.4, marginBottom: '1rem' }}>Connect</span>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', opacity: 0.8 }}>Instagram</a>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', opacity: 0.8 }}>Twitter / X</a>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', opacity: 0.8 }}>LinkedIn</a>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', opacity: 0.8 }}>Awwwards</a>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <span style={{ opacity: 0.4, marginBottom: '1rem' }}>Legal</span>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', opacity: 0.8 }}>Privacy Policy</a>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', opacity: 0.8 }}>Terms of Service</a>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', opacity: 0.8 }}>Cookie Notice</a>
          </div>
        </div>

        {/* The Helpline Slot */}
        <div style={{ 
          border: '1px solid rgba(255,255,255,0.1)', 
          padding: '2rem', 
          width: '100%',
          maxWidth: '350px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.02)'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', opacity: 0.6, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
              [ PRIORITY HELPLINE ]
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, opacity: 0.8 }}>
              Direct line for existing clients, urgent consultations, and critical technical incident reports.
            </p>
          </div>
          <div style={{ marginTop: '3rem', fontSize: '1.2rem', letterSpacing: '0.1em', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem', display: 'inline-block' }}>
            +1 (800) ROXTEN-HQ
          </div>
        </div>

      </div>

      {/* Bottom Metadata */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 5vw', fontSize: '0.7rem', letterSpacing: '0.1em', opacity: 0.6, textTransform: 'uppercase', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <span>© 2026 Roxten Studios. All Rights Reserved.</span>
        <span>Made in India — Worldwide</span>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </footer>
  );
}
