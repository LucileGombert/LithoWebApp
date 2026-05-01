import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFavoritesStore from '../store/useFavoritesStore';
import useCrystalStore from '../store/useCrystalStore';
import CrystalCard from '../components/CrystalCard';

export default function Favorites() {
  const { favorites, clearFavorites } = useFavoritesStore();
  const { crystals, fetchCrystals, loading } = useCrystalStore();

  useEffect(() => {
    fetchCrystals({});
  }, []);

  const favoriteCrystals = crystals.filter(c => favorites.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'var(--text)' }}>
          ♡ Mes favoris
        </h1>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          {favorites.length} cristal{favorites.length !== 1 ? 'x' : ''}
        </span>
        {favorites.length > 0 && (
          <button
            onClick={() => { if (confirm('Vider tous les favoris ?')) clearFavorites(); }}
            className="btn-secondary"
            style={{ marginLeft: 'auto', fontSize: '0.75rem' }}
          >
            Tout effacer
          </button>
        )}
      </div>

      <div className="divider-cel mb-6">✦ · · ✦</div>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '12rem' }}>
          <span style={{ color: 'var(--amber)', fontSize: '1.2rem', letterSpacing: '0.4rem' }}>✦ · · ✦</span>
        </div>
      )}

      {!loading && favorites.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-dim)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--ocre)' }}>♡</div>
          <p style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-sec)' }}>Aucun favori pour l'instant</p>
          <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Explorez la bibliothèque et ajoutez vos cristaux préférés</p>
          <Link to="/" className="btn-primary">Explorer la bibliothèque</Link>
        </div>
      )}

      {!loading && favoriteCrystals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {favoriteCrystals.map(crystal => (
            <CrystalCard key={crystal.id} crystal={crystal} />
          ))}
        </div>
      )}
    </div>
  );
}
