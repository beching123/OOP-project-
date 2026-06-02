import { Outlet, Link } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div>
      <header style={{ background: 'white', borderBottom: '1px solid #eee', padding: '1rem 0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1a1a1a', textDecoration: 'none', fontFamily: "Georgia, 'Times New Roman', serif" }}>
            TRENDORA
          </Link>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link to="/about" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', textDecoration: 'none' }}>About</Link>
            <Link to="/contact" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', textDecoration: 'none' }}>Contact</Link>
            <Link to="/return-policy" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', textDecoration: 'none' }}>Return Policy</Link>
            <Link to="/login" style={{ padding: '0.5rem 1.25rem', borderRadius: '999px', background: '#1a5c2e', color: 'white', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer style={{ background: '#1a1a1a', color: 'white', padding: '3rem 0 1.5rem', textAlign: 'center' }}>
        <div className="container">
          <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#c9a84c', textDecoration: 'none', fontFamily: "Georgia, 'Times New Roman', serif" }}>
            TRENDORA
          </Link>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.75rem' }}>
            &copy; 2026 TRENDORA. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
