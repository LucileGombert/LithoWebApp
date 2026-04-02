import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useCrystalStore from '../store/useCrystalStore';
import useFavoritesStore from '../store/useFavoritesStore';
import { crystalApi } from '../services/api';

// Catégories de stock avec libellés
const STOCK_CATEGORIES = [
  { key: 'perlesCailloux', label: 'Perles Cailloux' },
  { key: 'perles2mm', label: 'Perles 2mm' },
  { key: 'perles4mm', label: 'Perles 4mm' },
  { key: 'perles6mm', label: 'Perles 6mm' },
  { key: 'pierresRoulees', label: 'Pierres Roulées' },
  { key: 'pierresBrutes', label: 'Pierres Brutes' },
];

function StockEditor({ crystal, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [stockValues, setStockValues] = useState(crystal.stock || {});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await crystalApi.updateStock(crystal.id, stockValues);
      onUpdate(stockValues);
      setEditing(false);
    } catch (err) {
      alert('Erreur lors de la sauvegarde : ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-stone-200">📦 Stock</h3>
        <button
          onClick={() => setEditing(!editing)}
          className="text-xs text-violet-400 hover:text-violet-300 underline"
        >
          {editing ? 'Annuler' : 'Modifier'}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {STOCK_CATEGORIES.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between bg-stone-800 rounded-xl px-3 py-2">
            <span className="text-xs text-stone-400">{label}</span>
            {editing ? (
              <input
                type="number"
                min="0"
                value={stockValues[key] ?? 0}
                onChange={e => setStockValues(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                className="w-16 bg-stone-700 border border-stone-600 rounded-lg px-2 py-1 text-sm text-stone-100 text-right focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            ) : (
              <span className={`text-sm font-medium ${
                (stockValues[key] || 0) === 0 ? 'text-red-400' :
                (stockValues[key] || 0) < 5 ? 'text-amber-400' : 'text-green-400'
              }`}>
                {stockValues[key] || 0}
              </span>
            )}
          </div>
        ))}
      </div>
      {editing && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary w-full mt-4 text-sm"
        >
          {saving ? 'Sauvegarde...' : '💾 Enregistrer le stock'}
        </button>
      )}
    </div>
  );
}

export default function CrystalDetail() {
  const { id } = useParams();
  const { fetchCrystalById, selectedCrystal: crystal, loading, error, updateStockLocal } = useCrystalStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  useEffect(() => {
    fetchCrystalById(id);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin text-4xl">💎</div>
      </div>
    );
  }

  if (error || !crystal) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-400">
          ⚠️ Cristal non trouvé
        </div>
        <Link to="/" className="btn-secondary inline-block mt-4">← Retour</Link>
      </div>
    );
  }

  const fav = isFavorite(crystal.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-slide-up">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-stone-500 mb-6">
        <Link to="/" className="hover:text-stone-300 transition-colors">Bibliothèque</Link>
        <span>/</span>
        <span className="text-stone-300">{crystal.name}</span>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Colonne gauche */}
        <div className="md:col-span-2 space-y-4">
          {/* Visuel */}
          <div
            className="rounded-2xl h-64 flex items-center justify-center border border-stone-800"
            style={{ background: `radial-gradient(circle, ${crystal.color}44, ${crystal.color}11)` }}
          >
            <div
              className="w-28 h-28 rounded-full shadow-2xl"
              style={{ backgroundColor: crystal.color, boxShadow: `0 0 60px ${crystal.color}88` }}
            />
          </div>

          {/* Favoris */}
          <button
            onClick={() => toggleFavorite(crystal.id)}
            className={`w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              fav ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/30'
                  : 'btn-secondary'
            }`}
          >
            {fav ? '❤️ Dans vos favoris' : '🤍 Ajouter aux favoris'}
          </button>

          {/* Infos rapides */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-sm">
            {crystal.hardness && (
              <div className="flex justify-between">
                <span className="text-stone-500">Dureté (Mohs)</span>
                <span className="text-stone-200">{crystal.hardness}</span>
              </div>
            )}
            {crystal.origin && (
              <div className="flex justify-between">
                <span className="text-stone-500">Origine</span>
                <span className="text-stone-200 text-right max-w-32">{crystal.origin}</span>
              </div>
            )}
            {crystal.color && (
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Couleur principale</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: crystal.color }} />
                </div>
              </div>
            )}
          </div>

          {/* Stock */}
          {crystal.stock && (
            <StockEditor crystal={crystal} onUpdate={(s) => updateStockLocal(crystal.id, s)} />
          )}
        </div>

        {/* Colonne droite */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl text-stone-100">{crystal.name}</h1>
              {crystal.description && (
                <p className="mt-2 text-stone-400 leading-relaxed">{crystal.description}</p>
              )}
            </div>
          </div>

          {/* Vertus */}
          {crystal.virtues?.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">✨ Vertus</h2>
              <div className="flex flex-wrap gap-2">
                {crystal.virtues.map(v => (
                  <span key={v} className="badge bg-violet-600/20 text-violet-300 border border-violet-500/30">
                    {v}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Chakras */}
          {crystal.chakras?.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">🌀 Chakras associés</h2>
              <div className="flex flex-wrap gap-2">
                {crystal.chakras.map(ch => (
                  <span
                    key={ch.id}
                    className="badge"
                    style={{ backgroundColor: ch.color + '22', borderColor: ch.color + '55', color: ch.color, border: '1px solid' }}
                  >
                    {ch.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Signes Zodiac */}
          {crystal.zodiacSigns?.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">♈ Signes associés</h2>
              <div className="flex flex-wrap gap-2">
                {crystal.zodiacSigns.map(z => (
                  <span key={z.id} className="badge bg-stone-800 text-stone-300 border border-stone-700">
                    {z.symbol} {z.name}
                    {z.element && <span className="text-stone-500 ml-1">· {z.element}</span>}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Compatibilités */}
          {crystal.compatibleWith?.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">💚 Compatible avec</h2>
              <div className="flex flex-wrap gap-2">
                {crystal.compatibleWith.map(c => (
                  <Link
                    key={c.id}
                    to={`/crystals/${c.id}`}
                    className="badge bg-green-900/20 text-green-400 border border-green-800/40 hover:bg-green-900/30 transition-colors"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    {c.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Incompatibilités */}
          {crystal.incompatibleWith?.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">⚠️ Incompatible avec</h2>
              <div className="flex flex-wrap gap-2">
                {crystal.incompatibleWith.map(c => (
                  <Link
                    key={c.id}
                    to={`/crystals/${c.id}`}
                    className="badge bg-red-900/20 text-red-400 border border-red-800/40 hover:bg-red-900/30 transition-colors"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    {c.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Précautions */}
          {crystal.precautions?.length > 0 && (
            <section className="bg-amber-900/10 border border-amber-800/30 rounded-xl p-4">
              <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">⚠️ Précautions</h2>
              <ul className="space-y-1">
                {crystal.precautions.map(p => (
                  <li key={p.id} className="text-sm text-amber-300/80">· {p.description}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
