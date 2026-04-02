import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFavoritesStore from '../store/useFavoritesStore';
import useCrystalStore from '../store/useCrystalStore';
import CrystalCard from '../components/CrystalCard';

export default function Favorites() {
  const { favorites, clearFavorites } = useFavoritesStore();
  const { crystals, fetchCrystals, loading } = useCrystalStore();

  useEffect(() => {
    // Charger tous les cristaux pour filtrer les favoris côté client
    fetchCrystals({});
  }, []);

  const favoriteCrystals = crystals.filter(c => favorites.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-stone-100 mb-1">Mes Favoris</h1>
          <p className="text-stone-400">
            {favorites.length} cristal{favorites.length !== 1 ? 's' : ''} sauvegardé{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>
        {favorites.length > 0 && (
          <button
            onClick={() => { if (confirm('Vider tous les favoris ?')) clearFavorites(); }}
            className="btn-secondary text-sm"
          >
            Tout effacer
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin text-4xl">💎</div>
        </div>
      )}

      {!loading && favorites.length === 0 && (
        <div className="text-center py-20 text-stone-500">
          <div className="text-6xl mb-4">🤍</div>
          <p className="text-lg mb-2">Aucun favori pour l'instant</p>
          <p className="text-sm text-stone-600 mb-6">Explorez la bibliothèque et ajoutez vos cristaux préférés</p>
          <Link to="/" className="btn-primary">
            Explorer la bibliothèque
          </Link>
        </div>
      )}

      {!loading && favoriteCrystals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favoriteCrystals.map(crystal => (
            <CrystalCard key={crystal.id} crystal={crystal} />
          ))}
        </div>
      )}
    </div>
  );
}
