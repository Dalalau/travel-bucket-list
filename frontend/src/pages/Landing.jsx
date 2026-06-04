import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.emoji}>🌍</div>
        <h1 style={styles.title}>Travel Bucket List</h1>
        <p style={styles.tagline}>Dream it. Plan it. Live it.</p>
        <p style={styles.description}>
          Keep track of every destination you've ever dreamed of visiting.
          Organize by continent, priority, and budget — and mark them off
          as you go.
        </p>
        <div style={styles.actions}>
          {isAuthenticated ? (
            <Link to="/destinations" style={styles.primaryBtn}>
              My Destinations →
            </Link>
          ) : (
            <>
              <Link to="/register" style={styles.primaryBtn}>Get Started</Link>
              <Link to="/login" style={styles.secondaryBtn}>Login</Link>
            </>
          )}
        </div>
      </div>

      <div style={styles.features}>
        <div style={styles.feature}>
          <span style={styles.featureIcon}>📍</span>
          <h3>Track Destinations</h3>
          <p>Add every place you want to visit with budget estimates and priority levels.</p>
        </div>
        <div style={styles.feature}>
          <span style={styles.featureIcon}>✅</span>
          <h3>Mark as Visited</h3>
          <p>Check off destinations as you visit them and watch your list grow.</p>
        </div>
        <div style={styles.feature}>
          <span style={styles.featureIcon}>📊</span>
          <h3>See Your Stats</h3>
          <p>View your travel budget, progress by continent, and more.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'sans-serif', color: '#1a1a2e' },
  hero: {
    textAlign: 'center',
    padding: '5rem 2rem',
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    color: 'white',
  },
  emoji: { fontSize: '4rem', marginBottom: '1rem' },
  title: { fontSize: '3rem', margin: '0 0 1rem', fontWeight: 'bold' },
  tagline: { fontSize: '1.4rem', color: '#a0c4ff', marginBottom: '1.5rem' },
  description: {
    maxWidth: '600px',
    margin: '0 auto 2.5rem',
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#ccc',
  },
  actions: { display: 'flex', gap: '1rem', justifyContent: 'center' },
  primaryBtn: {
    background: '#457b9d',
    color: 'white',
    padding: '0.8rem 2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  secondaryBtn: {
    background: 'transparent',
    color: 'white',
    padding: '0.8rem 2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    border: '2px solid white',
  },
  features: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    padding: '4rem 2rem',
    flexWrap: 'wrap',
  },
  feature: {
    maxWidth: '260px',
    textAlign: 'center',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  featureIcon: { fontSize: '2.5rem' },
};