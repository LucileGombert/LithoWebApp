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
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-100 mb-2">
          Bibliothèque de Cristaux
        </h1>
        <p className="text-stone-400">
          Découvrez les propriétés énergétiques et thérapeutiques de chaque pierre.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar filtres */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className="space-y-4 sticky top-24">
            <SearchBar />
            <FilterBar />
          </div>
        </aside>

        {/* Grille cristaux */}
        <main className="flex-1">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin text-4xl">💎</div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-400">
              ⚠️ {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <p className="text-stone-500 text-sm mb-4">
                {crystals.length} cristal{crystals.length !== 1 ? 's' : ''} trouvé{crystals.length !== 1 ? 's' : ''}
              </p>
              {crystals.length === 0 ? (
                <div className="text-center py-16 text-stone-500">
                  <div className="text-5xl mb-4">🔍</div>
                  <p>Aucun cristal ne correspond à votre recherche</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {crystals.map(crystal => (
                    <CrystalCard key={crystal.id} crystal={crystal} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
