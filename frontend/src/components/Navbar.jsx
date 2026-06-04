import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  return (
    <>
      <nav style={s.nav}>
        <Link to="/" style={s.brand}>
          <span style={s.brandIcon}>✈</span>
          <span style={s.brandText}>Travel Bucket List</span>
        </Link>
        <button style={s.burger} onClick={() => setOpen(!open)}>
          {open ? '✕' : '☰'}
        </button>
      </nav>
      {open && (
        <div style={s.drawer}>
          {isAuthenticated ? (
            <>
              <div style={s.drawerUser}>👤 {user?.name}</div>
              <Link to="/destinations" style={s.drawerLink} onClick={() => setOpen(false)}>🗺 My List</Link>
              <button onClick={handleLogout} style={s.drawerLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={s.drawerLink} onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" style={s.drawerLink} onClick={() => setOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </>
  );
}

const s = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1.5rem',
    height: '64px',
    background: 'var(--navy)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    textDecoration: 'none',
  },
  brandIcon: {
    fontSize: '1.4rem',
    color: 'var(--amber)',
  },
  brandText: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.15rem',
    fontWeight: '700',
    color: 'var(--white)',
    letterSpacing: '0.01em',
  },
  burger: {
    background: 'none',
    border: '1.5px solid rgba(255,255,255,0.2)',
    color: 'var(--white)',
    fontSize: '1.2rem',
    cursor: 'pointer',
    borderRadius: '8px',
    padding: '0.35rem 0.7rem',
    transition: 'border-color 0.2s',
  },
  drawer: {
    position: 'fixed',
    top: '64px',
    left: 0,
    right: 0,
    background: 'var(--navy-mid)',
    zIndex: 99,
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  drawerUser: {
    color: 'var(--amber)',
    fontWeight: '600',
    fontSize: '1rem',
    padding: '0.5rem 0',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    marginBottom: '0.5rem',
  },
  drawerLink: {
    color: 'var(--white)',
    textDecoration: 'none',
    fontSize: '1.05rem',
    padding: '0.75rem 0',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    display: 'block',
  },
  drawerLogout: {
    marginTop: '0.5rem',
    background: 'var(--danger)',
    color: 'white',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
  },
};