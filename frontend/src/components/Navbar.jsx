import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🌍 Travel Bucket List</Link>

      {/* Hamburger button for mobile */}
      <button
        style={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Desktop links */}
      <div style={styles.desktopLinks}>
        {isAuthenticated ? (
          <>
            <span style={styles.welcome}>Hi, {user?.name}</span>
            <Link to="/destinations" style={styles.link}>My List</Link>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {isAuthenticated ? (
            <>
              <span style={styles.mobileWelcome}>Hi, {user?.name}</span>
              <Link to="/destinations" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>My List</Link>
              <button onClick={handleLogout} style={styles.mobileButton}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    background: '#1a1a2e',
    color: 'white',
    position: 'relative',
    flexWrap: 'wrap',
  },
  brand: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
  },
  hamburger: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    '@media (max-width: 600px)': {
      display: 'block',
    },
  },
  desktopLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    color: '#e0e0e0',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  welcome: {
    color: '#a0c4ff',
  },
  button: {
    background: '#e63946',
    color: 'white',
    border: 'none',
    padding: '0.4rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    background: '#16213e',
    padding: '1rem',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  mobileLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.1rem',
    padding: '0.5rem 0',
    borderBottom: '1px solid #333',
  },
  mobileWelcome: {
    color: '#a0c4ff',
    fontSize: '1rem',
  },
  mobileButton: {
    background: '#e63946',
    color: 'white',
    border: 'none',
    padding: '0.7rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    textAlign: 'left',
  },
};