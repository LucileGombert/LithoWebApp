import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useCrystalStore from '../store/useCrystalStore';
import useFavoritesStore from '../store/useFavoritesStore';
import { crystalApi, chakraApi, zodiacApi } from '../services/api';

const STOCK_CATEGORIES = [
  { key: 'perlesCailloux', label: 'Perles Cailloux' },
  { key: 'perles2mm', label: 'Perles 2mm' },
  { key: 'perles4mm', label: 'Perles 4mm' },
  { key: 'perles6mm', label: 'Perles 6mm' },
  { key: 'pierresRoulees', label: 'Pierres Roulées' },
  { key: 'pierresBrutes', label: 'Pierres Brutes' },
];

const CHAKRA_NAMES = ['Racine', 'Sacré', 'Plexus Solaire', 'Cœur', 'Gorge', 'Troisième Œil', 'Couronne'];
const ZODIAC_NAMES = ['Bélier', 'Taureau', 'Gémeaux', 'Cancer', 'Lion', 'Vierge', 'Balance', 'Scorpion', 'Sagittaire', 'Capricorne', 'Verseau', 'Poissons'];

// ─── Composants réutilisables pour le formulaire d'édition ────────────────────

function TagInput({ label, values, onChange, placeholder }) {
  const [input, setInput] = useState('');

  function addTag() {
    const v = input.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput('');
  }

  return (
    <div>
      <label className="block text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map(tag => (
          <span key={tag} className="flex items-center gap-1 bg-violet-600/20 text-violet-300 border border-violet-500/30 text-xs px-2 py-1 rounded-full">
            {tag}
            <button type="button" onClick={() => onChange(values.filter(t => t !== tag))} className="hover:text-red-400 ml-0.5">&times;</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
          placeholder={placeholder}
          className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-violet-500"
        />
        <button type="button" onClick={addTag} className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 text-stone-300 rounded-lg text-sm transition-colors">+</button>
      </div>
    </div>
  );
}

function MultiSelect({ label, options, selected, onChange }) {
  function toggle(value) {
    onChange(selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value]);
  }
  return (
    <div>
      <label className="block text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              selected.includes(opt)
                ? 'bg-violet-600/30 text-violet-300 border-violet-500'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:border-stone-500'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Éditeur de stock (mode lecture seule) ────────────────────────────────────

function StockDisplay({ stock }) {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
      <h3 className="font-semibold text-stone-200 mb-4">📦 Stock</h3>
      <div className="grid grid-cols-2 gap-3">
        {STOCK_CATEGORIES.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between bg-stone-800 rounded-xl px-3 py-2">
            <span className="text-xs text-stone-400">{label}</span>
            <span className={`text-sm font-medium ${
              (stock[key] || 0) === 0 ? 'text-red-400' :
              (stock[key] || 0) < 5 ? 'text-amber-400' : 'text-green-400'
            }`}>
              {stock[key] || 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function CrystalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCrystalById, selectedCrystal: crystal, loading, error } = useCrystalStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editError, setEditError] = useState('');
  const [chakras, setChakras] = useState([]);
  const [zodiacs, setZodiacs] = useState([]);

  useEffect(() => {
    fetchCrystalById(id);
    chakraApi.getAll().then(setChakras).catch(() => {});
    zodiacApi.getAll().then(setZodiacs).catch(() => {});
  }, [id]);

  function startEditing() {
    setEditForm({
      name: crystal.name,
      imageUrl: crystal.imageUrl || '',
      color: crystal.color,
      colors: crystal.colors || [],
      description: crystal.description || '',
      virtues: crystal.virtues || [],
      properties: crystal.properties || [],
      origin: crystal.origin || '',
      chakras: crystal.chakras?.map(c => c.name) || [],
      zodiacSigns: crystal.zodiacSigns?.map(z => z.name) || [],
      precautions: crystal.precautions?.map(p => p.description) || [],
      stock: crystal.stock ? {
        perlesCailloux: crystal.stock.perlesCailloux ?? 0,
        perles2mm: crystal.stock.perles2mm ?? 0,
        perles4mm: crystal.stock.perles4mm ?? 0,
        perles6mm: crystal.stock.perles6mm ?? 0,
        pierresRoulees: crystal.stock.pierresRoulees ?? 0,
        pierresBrutes: crystal.stock.pierresBrutes ?? 0,
      } : { perlesCailloux: 0, perles2mm: 0, perles4mm: 0, perles6mm: 0, pierresRoulees: 0, pierresBrutes: 0 },
    });
    setIsEditing(true);
    setEditError('');
  }

  function field(key, value) {
    setEditForm(f => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!editForm.name.trim()) { setEditError('Le nom est requis.'); return; }
    setSaving(true);
    setEditError('');
    try {
      const chakraIds = chakras.filter(c => editForm.chakras.includes(c.name)).map(c => c.id);
      const zodiacIds = zodiacs.filter(z => editForm.zodiacSigns.includes(z.name)).map(z => z.id);

      await crystalApi.update(id, {
        name: editForm.name.trim(),
        imageUrl: editForm.imageUrl || null,
        color: editForm.color,
        colors: editForm.colors,
        description: editForm.description,
        virtues: editForm.virtues,
        properties: editForm.properties,
        hardness: editForm.hardness ? parseFloat(editForm.hardness) : null,
        origin: editForm.origin || null,
        chakraIds,
        zodiacIds,
        precautions: editForm.precautions,
      });

      // Mettre à jour le stock séparément
      await crystalApi.updateStock(id, editForm.stock);

      await fetchCrystalById(id);
      setIsEditing(false);
    } catch (err) {
      setEditError(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Supprimer "${crystal.name}" définitivement ? Cette action est irréversible.`)) return;
    setDeleting(true);
    try {
      await crystalApi.delete(id);
      navigate('/');
    } catch (err) {
      alert('Erreur lors de la suppression : ' + err.message);
      setDeleting(false);
    }
  }

  // ── États de chargement / erreur ─────────────────────────────────────────

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
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-400">⚠️ Cristal non trouvé</div>
        <Link to="/" className="btn-secondary inline-block mt-4">← Retour</Link>
      </div>
    );
  }

  const fav = isFavorite(crystal.id);

  // ── Mode édition ──────────────────────────────────────────────────────────

  if (isEditing && editForm) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-slide-up">
        {/* En-tête édition */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <Link to="/" className="hover:text-stone-300 transition-colors">Bibliothèque</Link>
            <span>/</span>
            <span className="text-stone-300">{crystal.name}</span>
            <span>/</span>
            <span className="text-violet-400">Édition</span>
          </div>
          <button onClick={() => setIsEditing(false)} className="text-sm text-stone-500 hover:text-stone-300 transition-colors">
            ✕ Annuler
          </button>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6">

          {/* Nom + Couleur */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">Nom *</label>
              <input type="text" value={editForm.name} onChange={e => field('name', e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">Couleur principale *</label>
              <div className="flex items-center gap-3">
                <input type="color" value={editForm.color} onChange={e => field('color', e.target.value)}
                  className="h-10 w-16 rounded cursor-pointer bg-transparent border border-stone-700" />
                <input type="text" value={editForm.color} onChange={e => field('color', e.target.value)}
                  className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 font-mono text-sm focus:outline-none focus:border-violet-500" />
              </div>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">URL de l'image</label>
            <div className="flex gap-3 items-start">
              <input type="url" value={editForm.imageUrl} onChange={e => field('imageUrl', e.target.value)}
                placeholder="https://..."
                className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-violet-500" />
              {editForm.imageUrl && (
                <img src={editForm.imageUrl} alt="Aperçu"
                  className="h-16 w-16 rounded-lg object-cover border border-stone-700 flex-shrink-0"
                  onError={e => { e.target.style.display = 'none'; }} />
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">Description</label>
            <textarea value={editForm.description} onChange={e => field('description', e.target.value)} rows={3}
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-violet-500 resize-none"
              placeholder="Propriétés lithothérapeutiques..." />
          </div>

          {/* Origine */}
          <div>
            <label className="block text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">Origine</label>
            <input type="text" value={editForm.origin} onChange={e => field('origin', e.target.value)}
              placeholder="Ex: Brésil, Madagascar..."
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-violet-500" />
          </div>

          {/* Tags */}
          <TagInput label="Couleurs" values={editForm.colors} onChange={v => field('colors', v)} placeholder="Ex: violet — Entrée" />
          <TagInput label="Vertus / Bénéfices" values={editForm.virtues} onChange={v => field('virtues', v)} placeholder="Ex: Protection — Entrée" />
          <TagInput label="Propriétés générales" values={editForm.properties} onChange={v => field('properties', v)} placeholder="Ex: Pierre de méditation — Entrée" />
          <TagInput label="Précautions" values={editForm.precautions} onChange={v => field('precautions', v)} placeholder="Ex: Sensible à l'eau — Entrée" />

          {/* Chakras */}
          <MultiSelect
            label="Chakras associés"
            options={chakras.length ? chakras.map(c => c.name) : CHAKRA_NAMES}
            selected={editForm.chakras}
            onChange={v => field('chakras', v)}
          />

          {/* Zodiaque */}
          <MultiSelect
            label="Signes du zodiaque"
            options={zodiacs.length ? zodiacs.map(z => z.name) : ZODIAC_NAMES}
            selected={editForm.zodiacSigns}
            onChange={v => field('zodiacSigns', v)}
          />

          {/* Stock */}
          <div>
            <label className="block text-xs font-medium text-stone-400 uppercase tracking-wider mb-3">Stock</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {STOCK_CATEGORIES.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs text-stone-500 mb-1">{label}</label>
                  <input type="number" min="0" value={editForm.stock[key]}
                    onChange={e => field('stock', { ...editForm.stock, [key]: parseInt(e.target.value) || 0 })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 text-sm focus:outline-none focus:border-violet-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Erreur */}
        {editError && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{editError}</div>
        )}

        {/* Boutons */}
        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors">
            {saving ? <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />Sauvegarde...</> : '💾 Enregistrer'}
          </button>
          <button onClick={() => setIsEditing(false)}
            className="px-6 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl font-medium transition-colors">
            Annuler
          </button>
        </div>
      </div>
    );
  }

  // ── Mode affichage ────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-slide-up">
      {/* Breadcrumb + actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <Link to="/" className="hover:text-stone-300 transition-colors">Bibliothèque</Link>
          <span>/</span>
          <span className="text-stone-300">{crystal.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={startEditing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors">
            ✏️ Modifier
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/40 rounded-lg transition-colors disabled:opacity-50">
            {deleting ? '...' : '🗑️ Supprimer'}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Colonne gauche */}
        <div className="md:col-span-2 space-y-4">
          {/* Visuel */}
          <div
            className="rounded-2xl h-64 flex items-center justify-center border border-stone-800 overflow-hidden"
            style={{ background: `radial-gradient(circle, ${crystal.color}44, ${crystal.color}11)` }}
          >
            {crystal.imageUrl ? (
              <img src={crystal.imageUrl} alt={crystal.name} className="h-full w-full object-cover" />
            ) : (
              <div className="w-28 h-28 rounded-full shadow-2xl"
                style={{ backgroundColor: crystal.color, boxShadow: `0 0 60px ${crystal.color}88` }} />
            )}
          </div>

          {/* Favoris */}
          <button onClick={() => toggleFavorite(crystal.id)}
            className={`w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              fav ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/30' : 'btn-secondary'
            }`}>
            {fav ? '❤️ Dans vos favoris' : '🤍 Ajouter aux favoris'}
          </button>

          {/* Infos rapides */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-sm">
            {crystal.origin && (
              <div className="flex justify-between">
                <span className="text-stone-500">Origine</span>
                <span className="text-stone-200 text-right max-w-32">{crystal.origin}</span>
              </div>
            )}
            {crystal.color && (
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Couleur principale</span>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: crystal.color }} />
              </div>
            )}
          </div>

          {/* Stock */}
          {crystal.stock && <StockDisplay stock={crystal.stock} />}
        </div>

        {/* Colonne droite */}
        <div className="md:col-span-3 space-y-6">
          <div>
            <h1 className="font-serif text-3xl text-stone-100">{crystal.name}</h1>
            {crystal.description && (
              <p className="mt-2 text-stone-400 leading-relaxed">{crystal.description}</p>
            )}
          </div>

          {crystal.virtues?.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">✨ Vertus</h2>
              <div className="flex flex-wrap gap-2">
                {crystal.virtues.map(v => (
                  <span key={v} className="badge bg-violet-600/20 text-violet-300 border border-violet-500/30">{v}</span>
                ))}
              </div>
            </section>
          )}

          {crystal.chakras?.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">🌀 Chakras associés</h2>
              <div className="flex flex-wrap gap-2">
                {crystal.chakras.map(ch => (
                  <span key={ch.id} className="badge"
                    style={{ backgroundColor: ch.color + '22', borderColor: ch.color + '55', color: ch.color, border: '1px solid' }}>
                    {ch.name}
                  </span>
                ))}
              </div>
            </section>
          )}

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

          {crystal.compatibleWith?.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">💚 Compatible avec</h2>
              <div className="flex flex-wrap gap-2">
                {crystal.compatibleWith.map(c => (
                  <Link key={c.id} to={`/crystals/${c.id}`}
                    className="badge bg-green-900/20 text-green-400 border border-green-800/40 hover:bg-green-900/30 transition-colors">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {crystal.incompatibleWith?.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">⚠️ Incompatible avec</h2>
              <div className="flex flex-wrap gap-2">
                {crystal.incompatibleWith.map(c => (
                  <Link key={c.id} to={`/crystals/${c.id}`}
                    className="badge bg-red-900/20 text-red-400 border border-red-800/40 hover:bg-red-900/30 transition-colors">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

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
