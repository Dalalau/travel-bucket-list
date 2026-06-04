import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

const CONTINENTS = [
  'Africa', 'Antarctica', 'Asia', 'Europe',
  'North America', 'Oceania', 'South America'
];

export default function DestinationForm({ onSubmit, defaultValues, onCancel }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
      <div style={styles.grid}>
        <div style={styles.field}>
          <label>Destination Name *</label>
          <input
            {...register('name', { required: 'Required' })}
            style={styles.input}
            placeholder="e.g. Kyoto"
          />
          {errors.name && <span style={styles.error}>{errors.name.message}</span>}
        </div>
        <div style={styles.field}>
          <label>Country *</label>
          <input
            {...register('country', { required: 'Required' })}
            style={styles.input}
            placeholder="e.g. Japan"
          />
          {errors.country && <span style={styles.error}>{errors.country.message}</span>}
        </div>
        <div style={styles.field}>
          <label>Continent *</label>
          <select {...register('continent', { required: 'Required' })} style={styles.input}>
            <option value="">Select continent</option>
            {CONTINENTS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.continent && <span style={styles.error}>{errors.continent.message}</span>}
        </div>
        <div style={styles.field}>
          <label>Estimated Cost (€) *</label>
          <input
            {...register('estimatedCost', {
              required: 'Required',
              min: { value: 0, message: 'Must be positive' }
            })}
            style={styles.input}
            type="number"
            placeholder="e.g. 1500"
          />
          {errors.estimatedCost && <span style={styles.error}>{errors.estimatedCost.message}</span>}
        </div>
        <div style={styles.field}>
          <label>Priority (1-5) *</label>
          <input
            {...register('priority', {
              required: 'Required',
              min: { value: 1, message: 'Min 1' },
              max: { value: 5, message: 'Max 5' }
            })}
            style={styles.input}
            type="number"
            placeholder="1 = low, 5 = high"
          />
          {errors.priority && <span style={styles.error}>{errors.priority.message}</span>}
        </div>
        <div style={styles.field}>
          <label>Notes</label>
          <input
            {...register('notes')}
            style={styles.input}
            placeholder="Optional notes"
          />
        </div>
      </div>
      <div style={styles.checkboxField}>
        <input type="checkbox" {...register('visited')} id="visited" />
        <label htmlFor="visited">Already visited</label>
      </div>
      <div style={styles.actions}>
        <button type="submit" style={styles.submitBtn}>Save Destination</button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
        )}
      </div>
    </form>
  );
}

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  input: {
    padding: '0.6rem', borderRadius: '6px',
    border: '1px solid #ccc', fontSize: '1rem',
  },
  error: { color: '#e63946', fontSize: '0.8rem' },
  checkboxField: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  actions: { display: 'flex', gap: '1rem', marginTop: '0.5rem' },
  submitBtn: {
    background: '#1a1a2e', color: 'white',
    padding: '0.7rem 1.5rem', border: 'none',
    borderRadius: '8px', cursor: 'pointer', fontSize: '1rem',
  },
  cancelBtn: {
    background: '#eee', color: '#333',
    padding: '0.7rem 1.5rem', border: 'none',
    borderRadius: '8px', cursor: 'pointer', fontSize: '1rem',
  },
};