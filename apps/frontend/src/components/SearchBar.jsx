import { useCallback, useRef } from 'react';
import useCrystalStore from '../store/useCrystalStore';

export default function SearchBar() {
  const { filters, setFilter } = useCrystalStore();
  const debounceRef = useRef(null);

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilter('search', value);
    }, 350);
  }, [setFilter]);

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '999px',
      padding: '0.55rem 1.2rem',
      display: 'flex', alignItems: 'center', gap: '0.55rem',
      boxShadow: '0 2px 10px var(--sh)',
    }}>
      <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>⊙</span>
      <input
        type="text"
        placeholder="Rechercher un cristal, une vertu…"
        defaultValue={filters.search}
        onChange={handleChange}
        style={{
          border: 'none', background: 'none',
          fontSize: '0.85rem', color: 'var(--text)',
          flex: 1, outline: 'none',
          fontFamily: "'Inter', sans-serif",
        }}
      />
    </div>
  );
}
