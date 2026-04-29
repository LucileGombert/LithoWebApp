import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crystalApi, chakraApi, zodiacApi } from '../services/api';

// ─── Valeurs par défaut du formulaire ───────────────────────────────────────
const emptyForm = {
  name: '',
  color: '#8B5CF6',
  imageUrl: '',
  colors: [],
  description: '',
  virtues: [],
  properties: [],
  hardness: '',
  origin: '',
  chakras: [],
  zodiacSigns: [],
  precautions: [],
  stock: {
    perlesCailloux: 0,
    perles2mm: 0,
    perles4mm: 0,
    perles6mm: 0,
    pierresRoulees: 0,
    pierresBrutes: 0,
  },
};

const CHAKRA_NAMES = ['Racine', 'Sacré', 'Plexus Solaire', 'Cœur', 'Gorge', 'Troisième Œil', 'Couronne'];
const ZODIAC_NAMES = ['Bélier', 'Taureau', 'Gémeaux', 'Cancer', 'Lion', 'Vierge', 'Balance', 'Scorpion', 'Sagittaire', 'Capricorne', 'Verseau', 'Poissons'];

// ─── Composant tag éditable (liste de strings) ───────────────────────────────
function TagInput({ label, values, onChange, placeholder }) {
  const [input, setInput] = useState('');

  function addTag() {
    const v = input.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput('');
  }

  function removeTag(tag) {
    onChange(values.filter(t => t !== tag));
  }

  return (
    <div>
      <label className="block text-sm font-medium text-stone-300 mb-1">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map(tag => (
          <span key={tag} className="flex items-center gap-1 bg-violet-600/20 text-violet-300 border border-violet-500/30 text-xs px-2 py-1 rounded-full">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="text-violet-400 hover:text-red-400 ml-1">&times;</button>
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
          className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-violet-500"
        />
        <button type="button" onClick={addTag} className="px-3 py-2 bg-stone-700 hover:bg-stone-600 text-stone-300 rounded-lg text-sm transition-colors">
          Ajouter
        </button>
      </div>
    </div>
  );
}

// ─── Sélecteur multi-choix (chakras / signes) ────────────────────────────────
function MultiSelect({ label, options, selected, onChange }) {
  function toggle(value) {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-stone-300 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                active
                  ? 'bg-violet-600/30 text-violet-300 border-violet-500'
                  : 'bg-stone-800 text-stone-400 border-stone-700 hover:border-stone-500'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Formulaire d'édition complet ────────────────────────────────────────────
function CrystalForm({ form, onChange, chakras, zodiacs }) {
  function field(key, value) {
    onChange({ ...form, [key]: value });
  }

  return (
    <div className="space-y-6">
      {/* Nom + couleur */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-300 mb-1">Nom *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => field('name', e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-violet-500"
            placeholder="Ex: Améthyste"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-300 mb-1">Couleur principale *</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.color}
              onChange={e => field('color', e.target.value)}
              className="h-10 w-16 rounded cursor-pointer bg-transparent border border-stone-700"
            />
            <input
              type="text"
              value={form.color}
              onChange={e => field('color', e.target.value)}
              className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 font-mono text-sm focus:outline-none focus:border-violet-500"
              placeholder="#8B5CF6"
            />
          </div>
        </div>
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium text-stone-300 mb-1">URL de l'image</label>
        <div className="flex gap-3 items-start">
          <div className="flex-1">
            <input
              type="url"
              value={form.imageUrl}
              onChange={e => field('imageUrl', e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-violet-500"
              placeholder="https://..."
            />
          </div>
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Aperçu"
              className="h-16 w-16 rounded-lg object-cover border border-stone-700 flex-shrink-0"
              onError={e => { e.target.style.display = 'none'; }}
            />
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-stone-300 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={e => field('description', e.target.value)}
          rows={3}
          className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-violet-500 resize-none"
          placeholder="Décrivez les propriétés lithothérapeutiques du cristal..."
        />
      </div>

      {/* Dureté + Origine */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-300 mb-1">Dureté (Mohs)</label>
          <input
            type="number"
            min="1" max="10" step="0.5"
            value={form.hardness}
            onChange={e => field('hardness', e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-violet-500"
            placeholder="Ex: 7"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-300 mb-1">Origine</label>
          <input
            type="text"
            value={form.origin}
            onChange={e => field('origin', e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-violet-500"
            placeholder="Ex: Brésil, Madagascar..."
          />
        </div>
      </div>

      {/* Couleurs */}
      <TagInput
        label="Couleurs (toutes les teintes)"
        values={form.colors}
        onChange={v => field('colors', v)}
        placeholder="Ex: violet — puis Entrée"
      />

      {/* Vertus */}
      <TagInput
        label="Vertus / Bénéfices"
        values={form.virtues}
        onChange={v => field('virtues', v)}
        placeholder="Ex: Protection — puis Entrée"
      />

      {/* Propriétés */}
      <TagInput
        label="Propriétés générales"
        values={form.properties}
        onChange={v => field('properties', v)}
        placeholder="Ex: Pierre de méditation — puis Entrée"
      />

      {/* Précautions */}
      <TagInput
        label="Précautions d'usage"
        values={form.precautions}
        onChange={v => field('precautions', v)}
        placeholder="Ex: Sensible à l'eau — puis Entrée"
      />

      {/* Chakras */}
      <MultiSelect
        label="Chakras associés"
        options={chakras.length ? chakras.map(c => c.name) : CHAKRA_NAMES}
        selected={form.chakras}
        onChange={v => field('chakras', v)}
      />

      {/* Signes zodiaque */}
      <MultiSelect
        label="Signes du zodiaque"
        options={zodiacs.length ? zodiacs.map(z => z.name) : ZODIAC_NAMES}
        selected={form.zodiacSigns}
        onChange={v => field('zodiacSigns', v)}
      />

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium text-stone-300 mb-3">Stock initial</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { key: 'perlesCailloux', label: 'Perles cailloux' },
            { key: 'perles2mm', label: 'Perles 2mm' },
            { key: 'perles4mm', label: 'Perles 4mm' },
            { key: 'perles6mm', label: 'Perles 6mm' },
            { key: 'pierresRoulees', label: 'Pierres roulées' },
            { key: 'pierresBrutes', label: 'Pierres brutes' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs text-stone-500 mb-1">{label}</label>
              <input
                type="number"
                min="0"
                value={form.stock[key]}
                onChange={e => field('stock', { ...form.stock, [key]: parseInt(e.target.value) || 0 })}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AddCrystal() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('auto'); // 'auto' | 'semi-auto' | 'manual'
  const [crystalName, setCrystalName] = useState('');
  const [sourceUrls, setSourceUrls] = useState(['', '']);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [chakras, setChakras] = useState([]);
  const [zodiacs, setZodiacs] = useState([]);

  useEffect(() => {
    chakraApi.getAll().then(setChakras).catch(() => {});
    zodiacApi.getAll().then(setZodiacs).catch(() => {});
  }, []);

  // ── Recherche IA ──────────────────────────────────────────────────────────
  async function handleResearch() {
    if (!crystalName.trim()) {
      setError('Veuillez saisir le nom du cristal.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const urls = sourceUrls.filter(u => u.trim());
      const data = await crystalApi.research({
        name: crystalName.trim(),
        mode,
        urls: mode === 'semi-auto' ? urls : undefined,
      });

      setForm({
        name: data.name ?? crystalName,
        color: data.color ?? '#8B5CF6',
        imageUrl: data.imageUrl ?? '',
        colors: data.colors ?? [],
        description: data.description ?? '',
        virtues: data.virtues ?? [],
        properties: data.properties ?? [],
        hardness: data.hardness ?? '',
        origin: data.origin ?? '',
        chakras: data.chakras ?? [],
        zodiacSigns: data.zodiacSigns ?? [],
        precautions: data.precautions ?? [],
      });
      setShowForm(true);
    } catch (err) {
      setError(err.message || 'Erreur lors de la recherche. Réessayez.');
    } finally {
      setLoading(false);
    }
  }

  // ── Passage en mode manuel ────────────────────────────────────────────────
  function handleManual() {
    setForm({ ...emptyForm, name: crystalName });
    setShowForm(true);
    setError('');
  }

  // ── Sauvegarde en base ────────────────────────────────────────────────────
  async function handleSave() {
    if (!form.name.trim()) {
      setError('Le nom du cristal est requis.');
      return;
    }
    if (!form.color) {
      setError('La couleur principale est requise.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      // Résoudre les noms de chakras/zodiacs en IDs
      const chakraIds = chakras
        .filter(c => form.chakras.includes(c.name))
        .map(c => c.id);
      const zodiacIds = zodiacs
        .filter(z => form.zodiacSigns.includes(z.name))
        .map(z => z.id);

      const payload = {
        name: form.name.trim(),
        color: form.color,
        imageUrl: form.imageUrl || null,
        colors: form.colors,
        description: form.description,
        virtues: form.virtues,
        properties: form.properties,
        hardness: form.hardness ? parseFloat(form.hardness) : null,
        origin: form.origin || null,
        chakraIds,
        zodiacIds,
        precautions: form.precautions,
        stock: form.stock,
      };

      const created = await crystalApi.create(payload);
      navigate(`/crystals/${created.id}`);
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  }

  // ── Gestion des URLs (mode semi-auto) ─────────────────────────────────────
  function updateUrl(index, value) {
    setSourceUrls(prev => prev.map((u, i) => (i === index ? value : u)));
  }

  function addUrl() {
    setSourceUrls(prev => [...prev, '']);
  }

  function removeUrl(index) {
    setSourceUrls(prev => prev.filter((_, i) => i !== index));
  }

  // ─────────────────────────────────────────────────────────────────────────
  const modes = [
    { key: 'auto', label: 'Automatique', icon: '✨', desc: 'Wikipedia + Gemini AI' },
    { key: 'semi-auto', label: 'Semi-automatique', icon: '🔗', desc: 'Tes sources + Gemini AI' },
    { key: 'manual', label: 'Manuel', icon: '✏️', desc: 'Saisie manuelle' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-100 mb-1">Ajouter un cristal</h1>
        <p className="text-stone-400 text-sm">Créez une nouvelle fiche dans la bibliothèque</p>
      </div>

      {/* Nom du cristal */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-stone-300 mb-2">
          Nom du cristal
        </label>
        <input
          type="text"
          value={crystalName}
          onChange={e => {
            setCrystalName(e.target.value);
            if (showForm) setForm(f => ({ ...f, name: e.target.value }));
          }}
          placeholder="Ex: Labradorite, Citrine, Obsidienne..."
          className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
        />
      </div>

      {/* Sélection du mode */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {modes.map(m => (
          <button
            key={m.key}
            type="button"
            onClick={() => { setMode(m.key); setShowForm(m.key === 'manual'); setError(''); }}
            className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border text-center transition-all ${
              mode === m.key
                ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                : 'bg-stone-900 border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-200'
            }`}
          >
            <span className="text-2xl">{m.icon}</span>
            <span className="font-medium text-sm">{m.label}</span>
            <span className="text-xs opacity-70">{m.desc}</span>
          </button>
        ))}
      </div>

      {/* Zone spécifique au mode */}
      {mode === 'auto' && !showForm && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 mb-6">
          <p className="text-stone-400 text-sm mb-4">
            L'IA va rechercher des informations sur ce cristal via <strong className="text-stone-200">Wikipedia</strong>, puis les structurer avec <strong className="text-stone-200">Gemini Flash</strong>.
          </p>
          <button
            type="button"
            onClick={handleResearch}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
          >
            {loading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Recherche en cours...
              </>
            ) : (
              <>✨ Lancer la recherche automatique</>
            )}
          </button>
        </div>
      )}

      {mode === 'semi-auto' && !showForm && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 mb-6 space-y-4">
          <p className="text-stone-400 text-sm">
            Colle les liens des pages sources à utiliser. Gemini analysera et croisera leur contenu.
          </p>
          {sourceUrls.map((url, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={e => updateUrl(i, e.target.value)}
                placeholder={`https://exemple.com/cristal-${i + 1}`}
                className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-violet-500"
              />
              {sourceUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeUrl(i)}
                  className="px-3 py-2 text-stone-500 hover:text-red-400 bg-stone-800 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={addUrl}
              className="flex items-center gap-1 px-3 py-2 text-sm text-stone-400 hover:text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
            >
              + Ajouter une source
            </button>
            <button
              type="button"
              onClick={handleResearch}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Analyse en cours...
                </>
              ) : (
                <>🔗 Analyser les sources</>
              )}
            </button>
          </div>
        </div>
      )}

      {mode === 'manual' && !showForm && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 mb-6">
          <p className="text-stone-400 text-sm mb-4">
            Remplissez toutes les informations manuellement dans le formulaire.
          </p>
          <button
            type="button"
            onClick={handleManual}
            className="w-full px-4 py-3 bg-stone-700 hover:bg-stone-600 text-stone-100 rounded-xl font-medium transition-colors"
          >
            ✏️ Ouvrir le formulaire
          </button>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Formulaire d'édition */}
      {showForm && (
        <>
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-stone-100 font-medium">
                {mode === 'manual' ? 'Remplissez les informations' : 'Vérifiez et modifiez si nécessaire'}
              </h2>
              <button
                type="button"
                onClick={() => { setShowForm(false); setError(''); }}
                className="text-stone-500 hover:text-stone-300 text-sm transition-colors"
              >
                ← Retour
              </button>
            </div>
            <CrystalForm
              form={form}
              onChange={setForm}
              chakras={chakras}
              zodiacs={zodiacs}
            />
          </div>

          {/* Bouton de sauvegarde */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed text-white rounded-xl font-medium text-base transition-colors"
            >
              {saving ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Enregistrement...
                </>
              ) : (
                <>💾 Enregistrer le cristal</>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl font-medium transition-colors"
            >
              Annuler
            </button>
          </div>
        </>
      )}
    </div>
  );
}
