import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { destinationsAPI } from '../services/api';
import DestinationForm from '../components/DestinationForm';

const CONTINENT_EMOJI = {
  'Africa': '🌍', 'Antarctica': '🧊', 'Asia': '🌏',
  'Europe': '🏰', 'North America': '🗽', 'Oceania': '🦘', 'South America': '🌿'
};

export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    destinationsAPI.getOne(id)
      .then(res => setDestination(res.data))
      .catch(() => navigate('/destinations'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (data) => {
    const res = await destinationsAPI.update(id, data);
    setDestination(res.data);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this destination?')) {
      await destinationsAPI.remove(id);
      navigate('/destinations');
    }
  };

  if (loading) return <div style={s.loading}>Loading...</div>;
  if (!destination) return null;

  return (
    <div style={s.page}>
      <button onClick={() => navigate('/destinations')} style={s.back}>← Back to list</button>

      {editing ? (
        <div style={s.card}>
          <h2 style={s.editTitle}>Edit destination</h2>
          <DestinationForm
            onSubmit={handleUpdate}
            defaultValues={destination}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : (
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div>
              <div style={s.continent}>
                {CONTINENT_EMOJI[destination.continent]} {destination.continent}
              </div>
              <h1 style={s.name}>{destination.name}</h1>
              <p style={s.country}>{destination.country}</p>
            </div>
            <div style={destination.visited ? s.visitedBadge : s.notVisitedBadge}>
              {destination.visited ? '✅ Visited' : '🗺 Bucket list'}
            </div>
          </div>

          <div style={s.detailGrid}>
            <div style={s.detailItem}>
              <span style={s.detailLabel}>Estimated budget</span>
              <span style={s.detailValue}>€{destination.estimatedCost.toLocaleString()}</span>
            </div>
            <div style={s.detailItem}>
              <span style={s.detailLabel}>Priority</span>
              <span style={s.detailValue}>
                <span style={s.stars}>{'★'.repeat(destination.priority)}{'☆'.repeat(5 - destination.priority)}</span>
                <span style={s.starsNum}> {destination.priority}/5</span>
              </span>
            </div>
            <div style={s.detailItem}>
              <span style={s.detailLabel}>Added on</span>
              <span style={s.detailValue}>{new Date(destination.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div style={s.detailItem}>
              <span style={s.detailLabel}>Last updated</span>
              <span style={s.detailValue}>{new Date(destination.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {destination.notes && (
            <div style={s.notes}>
              <span style={s.notesLabel}>Notes</span>
              <p style={s.notesText}>{destination.notes}</p>
            </div>
          )}

          <div style={s.actions}>
            <button onClick={() => setEditing(true)} style={s.editBtn}>Edit destination</button>
            <button onClick={handleDelete} style={s.deleteBtn}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { maxWidth: '720px', margin: '0 auto', padding: '1.5rem 1rem 3rem' },
  loading: { textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' },
  back: {
    background: 'none', border: 'none',
    color: 'var(--navy)', cursor: 'pointer',
    fontSize: '0.95rem', marginBottom: '1.5rem',
    padding: 0, fontFamily: 'var(--font-body)',
    fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem',
  },
  card: {
    background: 'var(--white)',
    borderRadius: 'var(--radius)',
    padding: 'clamp(1.25rem, 4vw, 2rem)',
    boxShadow: 'var(--shadow-lg)',
  },
  editTitle: { fontFamily: 'var(--font-display)', marginBottom: '1.5rem', color: 'var(--navy)' },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  continent: { color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.4rem' },
  name: { fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', color: 'var(--navy)', fontWeight: '900', marginBottom: '0.25rem' },
  country: { color: 'var(--text-muted)', fontSize: '1rem' },
  visitedBadge: {
    background: '#dcfce7', color: 'var(--success)',
    padding: '0.4rem 1rem', borderRadius: '99px',
    fontWeight: '600', fontSize: '0.85rem', whiteSpace: 'nowrap',
  },
  notVisitedBadge: {
    background: 'rgba(232,168,56,0.12)', color: 'var(--amber-dark)',
    padding: '0.4rem 1rem', borderRadius: '99px',
    fontWeight: '600', fontSize: '0.85rem', whiteSpace: 'nowrap',
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.75rem',
    padding: '1.5rem',
    background: 'var(--cream)',
    borderRadius: 'var(--radius-sm)',
  },
  detailItem: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  detailLabel: { fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  detailValue: { fontSize: '1rem', fontWeight: '500', color: 'var(--navy)' },
  stars: { color: 'var(--amber)', fontSize: '1.1rem' },
  starsNum: { color: 'var(--text-muted)', fontSize: '0.9rem' },
  notes: {
    background: 'var(--cream)',
    borderRadius: 'var(--radius-sm)',
    padding: '1.25rem',
    marginBottom: '1.75rem',
    borderLeft: '3px solid var(--amber)',
  },
  notesLabel: { fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.5rem' },
  notesText: { color: 'var(--text)', lineHeight: 1.6, fontSize: '0.95rem' },
  actions: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  editBtn: {
    flex: 1, minWidth: '140px',
    background: 'var(--navy)', color: 'var(--white)',
    border: 'none', padding: '0.8rem 1.5rem',
    borderRadius: 'var(--radius-sm)', cursor: 'pointer',
    fontSize: '0.95rem', fontWeight: '600', fontFamily: 'var(--font-body)',
  },
  deleteBtn: {
    background: '#fee2e2', color: 'var(--danger)',
    border: 'none', padding: '0.8rem 1.5rem',
    borderRadius: 'var(--radius-sm)', cursor: 'pointer',
    fontSize: '0.95rem', fontFamily: 'var(--font-body)', fontWeight: '500',
  },
};