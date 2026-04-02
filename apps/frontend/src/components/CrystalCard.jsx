import { Link } from 'react-router-dom';
import useFavoritesStore from '../store/useFavoritesStore';

// Couleur de badge pour les chakras
function ChakraBadge({ chakra }) {
  return (
    <span
      className="badge text-white text-xs"
      style={{ backgroundColor: chakra.color + '33', border: `1px solid ${chakra.color}66`, color: chakra.color }}
    >
      {chakra.name}
    </span>
  );
}

export default function CrystalCard({ crystal }) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const fav = isFavorite(crystal.id);

  // Calcul du stock total
  const totalStock = crystal.stock
    ? Object.entries(crystal.stock)
        .filter(([k]) => !['id', 'crystalId', 'updatedAt'].includes(k))
        .reduce((sum, [, v]) => sum + (v || 0), 0)
    : null;

  return (
    <div className="crystal-card group relative animate-fade-in">
      {/* Image / Couleur */}
      <Link to={`/crystals/${crystal.id}`}>
        <div
          className="h-40 w-full flex items-center justify-center relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${crystal.color}33, ${crystal.color}11)` }}
        >
          {crystal.imageUrl ? (
            <img src={crystal.imageUrl} alt={crystal.name} className="h-full w-full object-cover" />
          ) : (
            <div
              className="w-16 h-16 rounded-full opacity-80 shadow-lg"
              style={{ backgroundColor: crystal.color, boxShadow: `0 0 30px ${crystal.color}66` }}
            />
          )}
          {/* Badge stock */}
          {totalStock !== null && (
            <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${
              totalStock === 0 ? 'bg-red-900/80 text-red-300' :
              totalStock < 10 ? 'bg-amber-900/80 text-amber-300' :
              'bg-green-900/80 text-green-300'
            }`}>
              {totalStock === 0 ? 'Rupture' : `${totalStock} en stock`}
            </span>
          )}
        </div>
      </Link>

      {/* Contenu */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/crystals/${crystal.id}`}>
            <h3 className="font-semibold text-stone-100 hover:text-violet-300 transition-colors">
              {crystal.name}
            </h3>
          </Link>
          {/* Bouton favori */}
          <button
            onClick={() => toggleFavorite(crystal.id)}
            className="text-lg flex-shrink-0 transition-transform hover:scale-125"
            title={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            {fav ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Vertus (3 max) */}
        {crystal.virtues?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {crystal.virtues.slice(0, 3).map(v => (
              <span key={v} className="badge bg-stone-800 text-stone-400 text-xs border border-stone-700">
                {v}
              </span>
            ))}
            {crystal.virtues.length > 3 && (
              <span className="badge bg-stone-800 text-stone-500 text-xs">
                +{crystal.virtues.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Chakras */}
        {crystal.chakras?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {crystal.chakras.slice(0, 2).map(c => (
              <ChakraBadge key={c.id} chakra={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
