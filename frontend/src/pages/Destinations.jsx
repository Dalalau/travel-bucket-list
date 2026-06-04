import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { destinationsAPI } from '../services/api';
import DestinationForm from '../components/DestinationForm';

const CONTINENTS = [
  'Africa', 'Antarctica', 'Asia', 'Europe',
  'North America', 'Oceania', 'South America'
];

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ continent: '', visited: '' });
  const [stats, setStats] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (filters.continent) params.continent = filters.continent;
      if (filters.visited !== '') params.visited = filters.visited;
      const res = await destinationsAPI.getAll(params);
      setDestinations(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await destinationsAPI.getStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDestinations();
    fetchStats();
  }, [page, filters]);

  const handleCreate = async (data) => {
    await destinationsAPI.create(data);
    setShowForm(false);
    fetchDestinations();
    fetchStats();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this destination?')) {
      await destinationsAPI.remove(id);
      fetchDestinations();
      fetchStats();
    }
  };

  return (
    <div style={styles.container}>
      {stats && (
        <div style={styles.statsBar}>
          <div style={styles.stat}>
            <span style={styles.statNum}>{stats.total}</span>
            <span style={styles.statLabel}>Total</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNum}>{stats.visited}</span>
            <span style={styles.statLabel}>Visited ✅</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNum}>{stats.notVisited}</span>
            <span style={styles.statLabel}>Remaining 🗺️</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNum}>
              €{stats.cost?.total ? Math.round(stats.cost.total).toLocaleString() : 0}
            </span>
            <span style={styles.statLabel}>Total Budget</span>
          </div>
        </div>
      )}

      <div style={styles.header}>
        <h2>My Destinations</h2>
        <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
          {showForm ? 'Cancel' : '+ Add Destination'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formContainer}>
          <DestinationForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div style={styles.filters}>
        <select
          value={filters.continent}
          onChange={e => { setFilters(f => ({ ...f, continent: e.target.value })); setPage(1); }}
          style={styles.filterInput}
        >
          <option value="">All Continents</option>
          {CONTINENTS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filters.visited}
          onChange={e => { setFilters(f => ({ ...f, visited: e.target.value })); setPage(1); }}
          style={styles.filterInput}
        >
          <option value="">All Status</option>
          <option value="true">Visited</option>
          <option value="false">Not Visited</option>
        </select>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : destinations.length === 0 ? (
        <div style={styles.empty}>
          <p>No destinations yet. Add your first one! 🌍</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {destinations.map(dest => (
            <div key={dest.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.visited}>{dest.visited ? '✅' : '🗺️'}</span>
                <span style={styles.priority}>{'⭐'.repeat(dest.priority)}</span>
              </div>
              <h3 style={styles.destName}>{dest.name}</h3>
              <p style={styles.location}>{dest.country} · {dest.continent}</p>
              <p style={styles.cost}>€{dest.estimatedCost.toLocaleString()}</p>
              {dest.notes && <p style={styles.notes}>{dest.notes}</p>}
              <div style={styles.cardActions}>
                <button
                  onClick={() => navigate(`/destinations/${dest.id}`)}
                  style={styles.viewBtn}
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(dest.id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            style={styles.pageBtn}
          >
            ← Prev
          </button>
          <span>Page {page} of {pagination.totalPages}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === pagination.totalPages}
            style={styles.pageBtn}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '2rem' },
  statsBar: {
    display: 'flex', gap: '1rem', marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  stat: {
    flex: 1, minWidth: '120px', background: '#1a1a2e',
    color: 'white', borderRadius: '10px', padding: '1rem',
    textAlign: 'center',
  },
  statNum: { display: 'block', fontSize: '1.8rem', fontWeight: 'bold' },
  statLabel: { fontSize: '0.85rem', color: '#a0c4ff' },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '1.5rem',
  },
  addBtn: {
    background: '#457b9d', color: 'white',
    border: 'none', padding: '0.6rem 1.2rem',
    borderRadius: '8px', cursor: 'pointer', fontSize: '1rem',
  },
  formContainer: {
    background: 'white', padding: '1.5rem',
    borderRadius: '12px', marginBottom: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  filters: { display: 'flex', gap: '1rem', marginBottom: '1.5rem' },
  filterInput: {
    padding: '0.6rem', borderRadius: '6px',
    border: '1px solid #ccc', fontSize: '1rem',
  },
  loading: { textAlign: 'center', padding: '3rem', color: '#888' },
  empty: { textAlign: 'center', padding: '3rem', color: '#888' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    background: 'white', borderRadius: '12px',
    padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  visited: { fontSize: '1.2rem' },
  priority: { fontSize: '0.9rem' },
  destName: { margin: '0 0 0.3rem', fontSize: '1.2rem', color: '#1a1a2e' },
  location: { color: '#666', margin: '0 0 0.3rem', fontSize: '0.9rem' },
  cost: { color: '#457b9d', fontWeight: 'bold', margin: '0 0 0.5rem' },
  notes: { color: '#888', fontSize: '0.85rem', margin: '0 0 1rem' },
  cardActions: { display: 'flex', gap: '0.5rem' },
  viewBtn: {
    flex: 1, background: '#1a1a2e', color: 'white',
    border: 'none', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer',
  },
  deleteBtn: {
    flex: 1, background: '#e63946', color: 'white',
    border: 'none', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer',
  },
  pagination: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', gap: '1rem', marginTop: '2rem',
  },
  pageBtn: {
    background: '#1a1a2e', color: 'white',
    border: 'none', padding: '0.5rem 1rem',
    borderRadius: '6px', cursor: 'pointer',
  },
};