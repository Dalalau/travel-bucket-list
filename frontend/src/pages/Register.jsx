import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      const res = await authAPI.register(data);
      login(res.data.token, res.data.user);
      navigate('/destinations');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.cardTop}>
          <span style={s.cardIcon}>🌍</span>
          <h2 style={s.title}>Start your journey</h2>
          <p style={s.sub}>Create your free account</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Your name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              style={s.input}
              placeholder="e.g. Alex"
            />
            {errors.name && <span style={s.error}>{errors.name.message}</span>}
          </div>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              {...register('email', { required: 'Email is required' })}
              style={s.input}
              type="email"
              placeholder="you@example.com"
            />
            {errors.email && <span style={s.error}>{errors.email.message}</span>}
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'At least 6 characters' }
              })}
              style={s.input}
              type="password"
              placeholder="Min. 6 characters"
            />
            {errors.password && <span style={s.error}>{errors.password.message}</span>}
          </div>
          {serverError && <div style={s.serverError}>{serverError}</div>}
          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? 'Creating account...' : 'Create account →'}
          </button>
        </form>
        <p style={s.footer}>
          Already have an account? <Link to="/login" style={s.footerLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
    padding: '2rem 1rem',
  },
  card: {
    background: 'var(--white)',
    borderRadius: 'var(--radius)',
    width: '100%',
    maxWidth: '420px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-lg)',
  },
  cardTop: {
    background: 'var(--navy)',
    padding: '2rem',
    textAlign: 'center',
  },
  cardIcon: {
    fontSize: '2rem',
    display: 'block',
    marginBottom: '0.75rem',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.8rem',
    color: 'var(--white)',
    fontWeight: '700',
    marginBottom: '0.25rem',
  },
  sub: { color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' },
  form: { padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: {
    padding: '0.8rem 1rem',
    borderRadius: 'var(--radius-sm)',
    border: '1.5px solid var(--cream-dark)',
    fontSize: '1rem',
    fontFamily: 'var(--font-body)',
    background: 'var(--cream)',
  },
  error: { color: 'var(--danger)', fontSize: '0.8rem' },
  serverError: {
    background: '#fee2e2',
    color: 'var(--danger)',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  btn: {
    background: 'var(--amber)',
    color: 'var(--navy)',
    padding: '0.9rem',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    marginTop: '0.5rem',
  },
  footer: { textAlign: 'center', padding: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', borderTop: '1px solid var(--cream-dark)' },
  footerLink: { color: 'var(--amber-dark)', fontWeight: '600', textDecoration: 'none' },
};