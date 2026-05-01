import { useEffect } from 'react';
import useCrystalStore from '../store/useCrystalStore';
import CrystalCard from '../components/CrystalCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';

export default function Home() {
  const { crystals, loading, error, fetchCrystals, fetchChakras, fetchZodiacs } = useCrystalStore();

  useEffect(() => {
    fetchCrystals();
    fetchChakras();
    fetchZodiacs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!loading && !error && (
        <div className="eyebrow mb-5">
          {crystals.length} cristal{crystals.length !== 1 ? 'x' : ''}
        </div>
      )}

      <div className="mb-4">
        <SearchBar />
      </div>

      <div className="mb-6">
        <FilterBar />
      </div>

      <div className="divider-cel mb-6">✦ · · ✦ · · ✦</div>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '16rem' }}>
          <span style={{ color: 'var(--amber)', fontSize: '1.2rem', letterSpacing: '0.4rem' }}>✦ · · ✦</span>
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(160,50,30,0.07)', border: '1px solid rgba(160,50,30,0.22)',
          borderRadius: '1rem', padding: '1rem', color: '#A03020', fontSize: '0.875rem',
        }}>
          {error}
        </div>
      )}

      {!loading && !error && crystals.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-dim)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--ocre)' }}>◇</div>
          <p>Aucun cristal ne correspond à votre recherche</p>
        </div>
      )}

      {!loading && !error && crystals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {crystals.map(crystal => (
            <CrystalCard key={crystal.id} crystal={crystal} />
          ))}
        </div>
      )}
    </div>
  );
}
