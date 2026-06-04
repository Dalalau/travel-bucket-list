import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { destinationsAPI } from '../services/api';
import DestinationForm from '../components/DestinationForm';

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

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!destination) return null;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/destinations')} style={styles.back}>
        ← Back to list
      </button>

      {editing ? (
        <div style={styles.card}>
          <h2>Edit Destination</h2>
          <DestinationForm
            onSubmit={handleUpdate}
            defaultValues={destination}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : (
        <div style={styles.card}>
          <div style={styles.topRow}>
            <div>
              <h1 style={styles.name}>{destination.name}</h1>
              <p style={styles.location}>{destination.country} · {destination.continent}</p>
            </div>
            <span style={styles.visitedBadge}>
              {destination.visited ? '✅ Visited' : '🗺️ Not Yet'}
            </span>
          </div>

          <div style={styles.detailGrid}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Estimated Cost</span>
              <span style={styles.detailValue}>€{destination.estimatedCost.toLocaleString()}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Priority</span>
              <span style={styles.detailValue}>{'⭐'.repeat(destination.priority)} ({destination.priority}/5)</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Added on</span>
              <span style={styles.detailValue}>
                {new Date(destination.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Last updated</span>
              <span style={styles.detailValue}>
                {new Date(destination.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {destination.notes && (
            <div style={styles.notes}>
              <strong>Notes:</strong>
              <p>{destination.notes}</p>
            </div>
          )}

          <div style={styles.actions}>
            <button onClick={() => setEditing(true)} style={styles.editBtn}>Edit</button>
            <button onClick={handleDelete} style={styles.deleteBtn}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
  loading: { textAlign: 'center', padding: '4rem' },
  back: {
    background: 'none', border: 'none',
    color: '#457b9d', cursor: 'pointer',
    fontSize: '1rem', marginBottom: '1.5rem', padding: 0,
  },
  card: {
    background: 'white', borderRadius: '12px',
    padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  topRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '2rem',
  },
  name: { margin: '0 0 0.3rem', fontSize: '2rem', color: '#1a1a2e' },
  location: { color: '#666', margin: 0 },
  visitedBadge: {
    background: '#f0f4f8', padding: '0.5rem 1rem',
    borderRadius: '20px', fontWeight: 'bold',
  },
  detailGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem', marginBottom: '1.5rem',
  },
  detailItem: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  detailLabel: { color: '#888', fontSize: '0.85rem', textTransform: 'uppercase' },
  detailValue: { fontSize: '1.1rem', fontWeight: '500', color: '#1a1a2e' },
  notes: {
    background: '#f8f9fa', padding: '1rem',
    borderRadius: '8px', marginBottom: '1.5rem',
  },
  actions: { display: 'flex', gap: '1rem' },
  editBtn: {
    background: '#457b9d', color: 'white',
    border: 'none', padding: '0.7rem 1.5rem',
    borderRadius: '8px', cursor: 'pointer', fontSize: '1rem',
  },
  deleteBtn: {
    background: '#e63946', color: 'white',
    border: 'none', padding: '0.7rem 1.5rem',
    borderRadius: '8px', cursor: 'pointer', fontSize: '1rem',
  },
};