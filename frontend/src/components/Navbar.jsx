import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🌍 Travel Bucket List</Link>
      <div style={styles.links}>
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
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: '#1a1a2e',
    color: 'white',
  },
  brand: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
  },
  links: {
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
};