import { useCallback, useRef } from 'react';
import useCrystalStore from '../store/useCrystalStore';

export default function SearchBar() {
  const { filters, setFilter } = useCrystalStore();
  const debounceRef = useRef(null);

  // Debounce pour éviter trop de requêtes
  const handleChange = useCallback((e) => {
    const value = e.target.value;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilter('search', value);
    }, 350);
  }, [setFilter]);

  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
        🔍
      </span>
      <input
        type="text"
        placeholder="Rechercher un cristal, une vertu..."
        defaultValue={filters.search}
        onChange={handleChange}
        className="input pl-10"
      />
    </div>
  );
}
