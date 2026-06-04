import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

const CONTINENTS = ['Africa','Antarctica','Asia','Europe','North America','Oceania','South America'];

export default function DestinationForm({ onSubmit, defaultValues, onCancel }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues });

  useEffect(() => { reset(defaultValues); }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={s.form}>
      <div style={s.grid}>
        <div style={s.field}>
          <label style={s.label}>Destination *</label>
          <input {...register('name', { required: 'Required' })} style={s.input} placeholder="e.g. Kyoto" />
          {errors.name && <span style={s.error}>{errors.name.message}</span>}
        </div>
        <div style={s.field}>
          <label style={s.label}>Country *</label>
          <input {...register('country', { required: 'Required' })} style={s.input} placeholder="e.g. Japan" />
          {errors.country && <span style={s.error}>{errors.country.message}</span>}
        </div>
        <div style={s.field}>
          <label style={s.label}>Continent *</label>
          <select {...register('continent', { required: 'Required' })} style={s.input}>
            <option value="">Select...</option>
            {CONTINENTS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.continent && <span style={s.error}>{errors.continent.message}</span>}
        </div>
        <div style={s.field}>
          <label style={s.label}>Budget (€) *</label>
          <input
            {...register('estimatedCost', { required: 'Required', min: { value: 0, message: 'Must be positive' } })}
            style={s.input} type="number" placeholder="e.g. 1500"
          />
          {errors.estimatedCost && <span style={s.error}>{errors.estimatedCost.message}</span>}
        </div>
        <div style={s.field}>
          <label style={s.label}>Priority (1–5) *</label>
          <input
            {...register('priority', { required: 'Required', min: { value: 1, message: 'Min 1' }, max: { value: 5, message: 'Max 5' } })}
            style={s.input} type="number" placeholder="5 = highest"
          />
          {errors.priority && <span style={s.error}>{errors.priority.message}</span>}
        </div>
        <div style={s.field}>
          <label style={s.label}>Notes</label>
          <input {...register('notes')} style={s.input} placeholder="Optional notes" />
        </div>
      </div>
      <div style={s.checkRow}>
        <input type="checkbox" {...register('visited')} id="visited" style={{ width: '18px', height: '18px', accentColor: 'var(--amber)' }} />
        <label htmlFor="visited" style={s.checkLabel}>Already visited this place</label>
      </div>
      <div style={s.actions}>
        <button type="submit" style={s.submitBtn}>Save destination</button>
        {onCancel && <button type="button" onClick={onCancel} style={s.cancelBtn}>Cancel</button>}
      </div>
    </form>
  );
}

const s = {
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: { fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: {
    padding: '0.7rem 0.9rem',
    borderRadius: 'var(--radius-sm)',
    border: '1.5px solid var(--cream-dark)',
    fontSize: '0.95rem',
    fontFamily: 'var(--font-body)',
    background: 'var(--cream)',
    width: '100%',
  },
  error: { color: 'var(--danger)', fontSize: '0.75rem' },
  checkRow: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  checkLabel: { fontSize: '0.95rem', color: 'var(--text)', cursor: 'pointer' },
  actions: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  submitBtn: {
    flex: 1, minWidth: '140px',
    background: 'var(--navy)', color: 'var(--white)',
    padding: '0.75rem 1.5rem', border: 'none',
    borderRadius: 'var(--radius-sm)', cursor: 'pointer',
    fontSize: '0.95rem', fontWeight: '600', fontFamily: 'var(--font-body)',
  },
  cancelBtn: {
    flex: 1, minWidth: '120px',
    background: 'var(--cream-dark)', color: 'var(--text)',
    padding: '0.75rem 1.5rem', border: 'none',
    borderRadius: 'var(--radius-sm)', cursor: 'pointer',
    fontSize: '0.95rem', fontFamily: 'var(--font-body)',
  },
};