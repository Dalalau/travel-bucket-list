import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { destinationsAPI } from '../services/api';
import DestinationForm from '../components/DestinationForm';

const CONTINENTS = ['Africa','Antarctica','Asia','Europe','North America','Oceania','South America'];

const CONTINENT_EMOJI = {
  'Africa': '🌍', 'Antarctica': '🧊', 'Asia': '🌏',
  'Europe': '🏰', 'North America': '🗽', 'Oceania': '🦘', 'South America': '🌿'
};

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ continent: '', visited: '' });
  const [stats, setStats] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (filters.continent) params.continent = filters.continent;
      if (filters.visited !== '') params.visited = filters.visited;
      const [destRes, statsRes] = await Promise.all([
        destinationsAPI.getAll(params),
        destinationsAPI.getStats(),
      ]);
      setDestinations(destRes.data.data);
      setPagination(destRes.data.pagination);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [page, filters]);

  const handleCreate = async (data) => {
    await destinationsAPI.create(data);
    setShowForm(false);
    fetchAll();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this destination?')) {
      await destinationsAPI.remove(id);
      fetchAll();
    }
  };

  return (
    <div style={s.page}>
      {stats && (
        <div style={s.statsBar}>
          {[
            { num: stats.total, label: 'Total', icon: '📍' },
            { num: stats.visited, label: 'Visited', icon: '✅' },
            { num: stats.notVisited, label: 'Remaining', icon: '🗺' },
            { num: `€${stats.cost?.total ? Math.round(stats.cost.total).toLocaleString() : 0}`, label: 'Budget', icon: '💰' },
          ].map(st => (
            <div key={st.label} style={s.statCard}>
              <span style={s.statIcon}>{st.icon}</span>
              <span style={s.statNum}>{st.num}</span>
              <span style={s.statLabel}>{st.label}</span>
            </div>
          ))}
        </div>
      )}

      <div style={s.toolbar}>
        <h1 style={s.pageTitle}>My Destinations</h1>
        <button onClick={() => setShowForm(!showForm)} style={showForm ? s.btnCancel : s.btnAdd}>
          {showForm ? '✕ Cancel' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <div style={s.formBox}>
          <h3 style={s.formTitle}>New destination</h3>
          <DestinationForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div style={s.filters}>
        <select value={filters.continent} onChange={e => { setFilters(f => ({ ...f, continent: e.target.value })); setPage(1); }} style={s.select}>
          <option value="">All continents</option>
          {CONTINENTS.map(c => <option key={c} value={c}>{CONTINENT_EMOJI[c]} {c}</option>)}
        </select>
        <select value={filters.visited} onChange={e => { setFilters(f => ({ ...f, visited: e.target.value })); setPage(1); }} style={s.select}>
          <option value="">All status</option>
          <option value="true">✅ Visited</option>
          <option value="false">🗺 Not yet</option>
        </select>
      </div>

      {loading ? (
        <div style={s.empty}>Loading your destinations...</div>
      ) : destinations.length === 0 ? (
        <div style={s.emptyState}>
          <div style={s.emptyIcon}>🌍</div>
          <h3 style={s.emptyTitle}>No destinations yet</h3>
          <p style={s.emptySub}>Add your first dream destination above!</p>
        </div>
      ) : (
        <div style={s.grid}>
          {destinations.map(dest => (
            <div key={dest.id} style={s.card} onClick={() => navigate(`/destinations/${dest.id}`)}>
              <div style={s.cardBadge}>
                <span style={dest.visited ? s.visitedBadge : s.notVisitedBadge}>
                  {dest.visited ? '✅ Visited' : '🗺 Bucket list'}
                </span>
                <span style={s.continentTag}>{CONTINENT_EMOJI[dest.continent]} {dest.continent}</span>
              </div>
              <h3 style={s.cardName}>{dest.name}</h3>
              <p style={s.cardCountry}>{dest.country}</p>
              <div style={s.cardMeta}>
                <span style={s.cardCost}>€{dest.estimatedCost.toLocaleString()}</span>
                <span style={s.cardPriority}>{'★'.repeat(dest.priority)}{'☆'.repeat(5 - dest.priority)}</span>
              </div>
              {dest.notes && <p style={s.cardNotes}>{dest.notes}</p>}
              <div style={s.cardFooter}>
                <button onClick={() => navigate(`/destinations/${dest.id}`)} style={s.viewBtn}>View details</button>
                <button onClick={(e) => handleDelete(dest.id, e)} style={s.delBtn}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div style={s.pagination}>
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1} style={s.pageBtn}>← Prev</button>
          <span style={s.pageInfo}>Page {page} of {pagination.totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.totalPages} style={s.pageBtn}>Next →</button>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem 3rem' },
  statsBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.75rem',
    marginBottom: '1.75rem',
  },
  statCard: {
    background: 'var(--navy)',
    borderRadius: 'var(--radius)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.2rem',
  },
  statIcon: { fontSize: '1.3rem' },
  statNum: { fontSize: '1.6rem', fontWeight: '700', color: 'var(--amber)', fontFamily: 'var(--font-display)' },
  statLabel: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '0.75rem' },
  pageTitle: { fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', color: 'var(--navy)' },
  btnAdd: {
    background: 'var(--amber)', color: 'var(--navy)',
    border: 'none', padding: '0.6rem 1.25rem',
    borderRadius: '99px', cursor: 'pointer',
    fontSize: '0.95rem', fontWeight: '700',
    fontFamily: 'var(--font-body)',
    whiteSpace: 'nowrap',
  },
  btnCancel: {
    background: 'var(--cream-dark)', color: 'var(--text)',
    border: 'none', padding: '0.6rem 1.25rem',
    borderRadius: '99px', cursor: 'pointer',
    fontSize: '0.95rem', fontFamily: 'var(--font-body)',
    whiteSpace: 'nowrap',
  },
  formBox: {
    background: 'var(--white)',
    borderRadius: 'var(--radius)',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: 'var(--shadow)',
    borderLeft: '4px solid var(--amber)',
  },
  formTitle: { fontFamily: 'var(--font-display)', marginBottom: '1.25rem', color: 'var(--navy)' },
  filters: { display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  select: {
    flex: 1, minWidth: '150px',
    padding: '0.65rem 0.9rem',
    borderRadius: 'var(--radius-sm)',
    border: '1.5px solid var(--cream-dark)',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    background: 'var(--white)',
    cursor: 'pointer',
  },
  empty: { textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' },
  emptyState: { textAlign: 'center', padding: '4rem 1rem' },
  emptyIcon: { fontSize: '3rem', marginBottom: '1rem' },
  emptyTitle: { fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '0.5rem' },
  emptySub: { color: 'var(--text-muted)' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    background: 'var(--white)',
    borderRadius: 'var(--radius)',
    padding: '1.25rem',
    boxShadow: 'var(--shadow)',
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  cardBadge: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' },
  visitedBadge: { background: '#dcfce7', color: 'var(--success)', padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600' },
  notVisitedBadge: { background: 'rgba(232,168,56,0.12)', color: 'var(--amber-dark)', padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600' },
  continentTag: { fontSize: '0.75rem', color: 'var(--text-muted)' },
  cardName: { fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--navy)', fontWeight: '700' },
  cardCountry: { color: 'var(--text-muted)', fontSize: '0.875rem' },
  cardMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardCost: { fontWeight: '700', color: 'var(--amber-dark)', fontSize: '1rem' },
  cardPriority: { color: 'var(--amber)', fontSize: '0.85rem', letterSpacing: '0.05em' },
  cardNotes: { color: 'var(--text-muted)', fontSize: '0.82rem', fontStyle: 'italic', borderTop: '1px solid var(--cream-dark)', paddingTop: '0.5rem' },
  cardFooter: { display: 'flex', gap: '0.5rem', marginTop: '0.25rem' },
  viewBtn: {
    flex: 1, background: 'var(--navy)', color: 'var(--white)',
    border: 'none', padding: '0.55rem',
    borderRadius: 'var(--radius-sm)', cursor: 'pointer',
    fontSize: '0.85rem', fontFamily: 'var(--font-body)', fontWeight: '500',
  },
  delBtn: {
    background: '#fee2e2', color: 'var(--danger)',
    border: 'none', padding: '0.55rem 0.75rem',
    borderRadius: 'var(--radius-sm)', cursor: 'pointer',
    fontSize: '0.9rem',
  },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' },
  pageBtn: {
    background: 'var(--navy)', color: 'var(--white)',
    border: 'none', padding: '0.6rem 1.25rem',
    borderRadius: '99px', cursor: 'pointer',
    fontSize: '0.9rem', fontFamily: 'var(--font-body)',
  },
  pageInfo: { color: 'var(--text-muted)', fontSize: '0.9rem' },
};