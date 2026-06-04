const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '0.75rem',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  input: {
    padding: '0.6rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    width: '100%',
    boxSizing: 'border-box',
  },
  error: { color: '#e63946', fontSize: '0.8rem' },
  checkboxField: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  actions: { display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' },
  submitBtn: {
    flex: 1,
    background: '#1a1a2e', color: 'white',
    padding: '0.7rem 1.5rem', border: 'none',
    borderRadius: '8px', cursor: 'pointer', fontSize: '1rem',
    minWidth: '140px',
  },
  cancelBtn: {
    flex: 1,
    background: '#eee', color: '#333',
    padding: '0.7rem 1.5rem', border: 'none',
    borderRadius: '8px', cursor: 'pointer', fontSize: '1rem',
    minWidth: '140px',
  },
};