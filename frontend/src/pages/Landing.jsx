import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const destinations = ['Tokyo', 'Santorini', 'Machu Picchu', 'Kyoto', 'Amalfi Coast', 'Patagonia'];

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <div style={s.hero}>
        <div style={s.heroOverlay} />
        <div style={s.heroContent}>
          <div style={s.badge}>✈ Your Personal Travel Journal</div>
          <h1 style={s.title}>
            Dream it.<br />
            <span style={s.titleAccent}>Plan it.</span><br />
            Live it.
          </h1>
          <p style={s.sub}>
            Track every destination you've ever dreamed of visiting.
            Organize by continent, budget, and priority.
          </p>
          <div style={s.actions}>
            {isAuthenticated ? (
              <Link to="/destinations" style={s.btnPrimary}>Open My List →</Link>
            ) : (
              <>
                <Link to="/register" style={s.btnPrimary}>Start for free</Link>
                <Link to="/login" style={s.btnSecondary}>Sign in</Link>
              </>
            )}
          </div>
          <div style={s.pills}>
            {destinations.map(d => (
              <span key={d} style={s.pill}>📍 {d}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={s.features}>
        <h2 style={s.sectionTitle}>Everything you need</h2>
        <div style={s.featureGrid}>
          {[
            { icon: '🗺', title: 'Build your list', desc: 'Add destinations with costs, priority, and notes. Your wishlist, perfectly organized.' },
            { icon: '✅', title: 'Track progress', desc: 'Mark destinations as visited and watch your adventures accumulate.' },
            { icon: '📊', title: 'Budget insights', desc: 'See total estimated costs, breakdown by continent, and spending stats.' },
            { icon: '🔒', title: 'Private & secure', desc: 'Your list is yours alone. JWT authentication keeps it private.' },
          ].map(f => (
            <div key={f.title} style={s.featureCard}>
              <div style={s.featureIcon}>{f.icon}</div>
              <h3 style={s.featureTitle}>{f.title}</h3>
              <p style={s.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={s.cta}>
        <h2 style={s.ctaTitle}>Where will you go next?</h2>
        <p style={s.ctaSub}>Join and start building your travel bucket list today.</p>
        <Link to="/register" style={s.btnPrimary}>Get started — it's free</Link>
      </div>
    </div>
  );
}

const s = {
  hero: {
    position: 'relative',
    minHeight: '92vh',
    background: 'linear-gradient(160deg, var(--navy) 0%, var(--navy-light) 60%, #2d4a6b 100%)',
    display: 'flex',
    alignItems: 'center',
    padding: '4rem 1.5rem',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(232,168,56,0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(45,74,107,0.4) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  heroContent: {
    position: 'relative',
    maxWidth: '680px',
    margin: '0 auto',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(232,168,56,0.15)',
    border: '1px solid rgba(232,168,56,0.3)',
    color: 'var(--amber)',
    padding: '0.4rem 1rem',
    borderRadius: '99px',
    fontSize: '0.85rem',
    fontWeight: '500',
    marginBottom: '1.5rem',
    letterSpacing: '0.05em',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(2.8rem, 8vw, 5rem)',
    fontWeight: '900',
    color: 'var(--white)',
    lineHeight: 1.1,
    marginBottom: '1.5rem',
  },
  titleAccent: {
    color: 'var(--amber)',
  },
  sub: {
    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.7,
    marginBottom: '2.5rem',
    maxWidth: '500px',
    margin: '0 auto 2.5rem',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '3rem',
  },
  btnPrimary: {
    background: 'var(--amber)',
    color: 'var(--navy)',
    padding: '0.85rem 2rem',
    borderRadius: '99px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 16px rgba(232,168,56,0.4)',
    display: 'inline-block',
  },
  btnSecondary: {
    background: 'rgba(255,255,255,0.1)',
    color: 'var(--white)',
    padding: '0.85rem 2rem',
    borderRadius: '99px',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1rem',
    border: '1.5px solid rgba(255,255,255,0.25)',
    display: 'inline-block',
  },
  pills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    justifyContent: 'center',
  },
  pill: {
    background: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.7)',
    padding: '0.35rem 0.85rem',
    borderRadius: '99px',
    fontSize: '0.8rem',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  features: {
    padding: '5rem 1.5rem',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '3rem',
    color: 'var(--navy)',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1.5rem',
  },
  featureCard: {
    background: 'var(--white)',
    borderRadius: 'var(--radius)',
    padding: '2rem',
    boxShadow: 'var(--shadow)',
    borderTop: '3px solid var(--amber)',
  },
  featureIcon: { fontSize: '2rem', marginBottom: '1rem' },
  featureTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.15rem',
    fontWeight: '700',
    marginBottom: '0.75rem',
    color: 'var(--navy)',
  },
  featureDesc: {
    color: 'var(--text-muted)',
    lineHeight: 1.6,
    fontSize: '0.95rem',
  },
  cta: {
    background: 'var(--navy)',
    padding: '5rem 1.5rem',
    textAlign: 'center',
  },
  ctaTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
    color: 'var(--white)',
    marginBottom: '1rem',
  },
  ctaSub: {
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '2rem',
    fontSize: '1.05rem',
  },
};