import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      const res = await authAPI.login(data);
      login(res.data.token, res.data.user);
      navigate('/destinations');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome back 👋</h2>
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <div style={styles.field}>
            <label>Email</label>
            <input
              {...register('email', { required: 'Email is required' })}
              style={styles.input}
              type="email"
              placeholder="you@example.com"
            />
            {errors.email && <span style={styles.error}>{errors.email.message}</span>}
          </div>
          <div style={styles.field}>
            <label>Password</label>
            <input
              {...register('password', { required: 'Password is required' })}
              style={styles.input}
              type="password"
              placeholder="••••••••"
            />
            {errors.password && <span style={styles.error}>{errors.password.message}</span>}
          </div>
          {serverError && <div style={styles.serverError}>{serverError}</div>}
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.footer}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '80vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: '#f0f4f8',
  },
  card: {
    background: 'white', padding: '2.5rem',
    borderRadius: '12px', width: '100%',
    maxWidth: '420px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  title: { textAlign: 'center', marginBottom: '2rem', color: '#1a1a2e' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  input: {
    padding: '0.7rem', borderRadius: '6px',
    border: '1px solid #ccc', fontSize: '1rem',
  },
  error: { color: '#e63946', fontSize: '0.85rem' },
  serverError: {
    background: '#ffe0e0', color: '#c00',
    padding: '0.7rem', borderRadius: '6px', textAlign: 'center',
  },
  button: {
    background: '#1a1a2e', color: 'white',
    padding: '0.8rem', border: 'none',
    borderRadius: '8px', fontSize: '1rem',
    cursor: 'pointer', fontWeight: 'bold',
  },
  footer: { textAlign: 'center', marginTop: '1.5rem', color: '#555' },
};