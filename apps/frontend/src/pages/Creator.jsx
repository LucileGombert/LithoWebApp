import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useCrystalStore from '../store/useCrystalStore';
import { crystalApi } from '../services/api';

// Couleurs disponibles pour la sélection
const COLORS = [
  { label: 'Violet', value: 'violet', hex: '#9B59B6' },
  { label: 'Rose', value: 'rose', hex: '#FFB6C1' },
  { label: 'Bleu', value: 'bleu', hex: '#26619C' },
  { label: 'Vert', value: 'vert', hex: '#4CAF50' },
  { label: 'Jaune', value: 'jaune', hex: '#F7C948' },
  { label: 'Orange', value: 'orange', hex: '#FF8C00' },
  { label: 'Rouge', value: 'rouge', hex: '#E74C3C' },
  { label: 'Noir', value: 'noir', hex: '#2C2C2C' },
  { label: 'Blanc', value: 'blanc', hex: '#F0F0F0' },
  { label: 'Marron', value: 'marron', hex: '#C8860A' },
];

// Objectifs prédéfinis courants
const OBJECTIVES_PRESETS = [
  'Protection', 'Amour', 'Sérénité', 'Énergie', 'Méditation',
  'Confiance', 'Intuition', 'Créativité', 'Ancrage', 'Guérison'
];

function SelectedCrystalPreview({ selectedCrystals, crystals, onRemove }) {
  if (selectedCrystals.length === 0) return null;

  const selected = crystals.filter(c => selectedCrystals.includes(c.id));

  // Vérifier les incompatibilités entre cristaux sélectionnés
  const incompatibilities = [];
  for (const c of selected) {
    for (const inc of (c.incompatibleWith || [])) {
      if (selectedCrystals.includes(inc.id)) {
        const pair = [c.name, inc.name].sort().join(' + ');
        if (!incompatibilities.includes(pair)) {
          incompatibilities.push(pair);
        }
      }
    }
  }

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
      <h3 className="font-semibold text-stone-200 mb-3">
        Ma sélection ({selected.length} cristal{selected.length > 1 ? 's' : ''})
      </h3>

      {/* Aperçu visuel — ligne de perles */}
      <div className="flex items-center gap-2 flex-wrap mb-4 p-3 bg-stone-800 rounded-xl min-h-14">
        {selected.map((c, i) => (
          <div key={c.id} className="flex items-center gap-1">
            <div
              className="w-6 h-6 rounded-full border border-white/10 shadow-sm flex-shrink-0"
              style={{ backgroundColor: c.color, boxShadow: `0 0 8px ${c.color}66` }}
              title={c.name}
            />
            {i < selected.length - 1 && (
              <div className="w-1 h-1 rounded-full bg-stone-600" />
            )}
          </div>
        ))}
      </div>

      {/* Liste */}
      <div className="space-y-2">
        {selected.map(c => (
          <div key={c.id} className="flex items-center justify-between bg-stone-800 rounded-xl px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
              <span className="text-sm text-stone-200">{c.name}</span>
            </div>
            <button
              onClick={() => onRemove(c.id)}
              className="text-stone-500 hover:text-red-400 transition-colors text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Incompatibilités */}
      {incompatibilities.length > 0 && (
        <div className="mt-3 bg-red-900/20 border border-red-800/40 rounded-xl p-3">
          <p className="text-xs font-semibold text-red-400 mb-1">⚠️ Incompatibilités détectées</p>
          {incompatibilities.map(pair => (
            <p key={pair} className="text-xs text-red-300/80">· {pair}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Creator() {
  const { creationTypes, fetchCreationTypes, crystals, fetchCrystals } = useCrystalStore();
  const [form, setForm] = useState({
    creationTypeId: '',
    color: '',
    objective: ''
  });
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCrystals, setSelectedCrystals] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchCreationTypes();
    fetchCrystals({});
  }, []);

  const handleSearch = async () => {
    if (!form.creationTypeId && !form.color && !form.objective) return;
    setLoading(true);
    try {
      const results = await crystalApi.suggest({
        color: form.color,
        objective: form.objective,
        creationTypeId: form.creationTypeId || undefined
      });
      setSuggestions(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAI = async () => {
    setAiLoading(true);
    try {
      const result = await crystalApi.generate({
        creationType: creationTypes.find(t => t.id === Number(form.creationTypeId))?.name,
        objective: form.objective
      });
      setAiResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedCrystals(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Cristaux affichés (suggestions si recherche effectuée, sinon tous)
  const displayed = suggestions.length > 0 ? suggestions : crystals;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-100 mb-2">✨ Créateur Artisanal</h1>
        <p className="text-stone-400">Composez votre création avec les cristaux qui vous correspondent.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Formulaire */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4">
            <h2 className="font-semibold text-stone-200">🎨 Votre création</h2>

            {/* Type de création */}
            <div>
              <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1.5">
                Type de création
              </label>
              <select
                value={form.creationTypeId}
                onChange={e => setForm(f => ({ ...f, creationTypeId: e.target.value }))}
                className="input text-sm"
              >
                <option value="">Sélectionner...</option>
                {creationTypes.map(t => (
                  <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                ))}
              </select>
            </div>

            {/* Couleur dominante */}
            <div>
              <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1.5">
                Couleur dominante
              </label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setForm(f => ({ ...f, color: f.color === c.value ? '' : c.value }))}
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                      form.color === c.value ? 'border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                  />
                ))}
              </div>
              {form.color && (
                <p className="text-xs text-stone-400 mt-1">
                  Couleur : <span className="text-violet-300">{form.color}</span>
                </p>
              )}
            </div>

            {/* Objectif */}
            <div>
              <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1.5">
                Objectif / intention
              </label>
              <input
                type="text"
                value={form.objective}
                onChange={e => setForm(f => ({ ...f, objective: e.target.value }))}
                placeholder="Ex: protection, méditation..."
                className="input text-sm mb-2"
              />
              <div className="flex flex-wrap gap-1.5">
                {OBJECTIVES_PRESETS.map(obj => (
                  <button
                    key={obj}
                    onClick={() => setForm(f => ({ ...f, objective: f.objective === obj ? '' : obj }))}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      form.objective === obj
                        ? 'bg-violet-600/30 text-violet-300 border-violet-500/50'
                        : 'bg-stone-800 text-stone-400 border-stone-700 hover:border-stone-500'
                    }`}
                  >
                    {obj}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? '⏳ Recherche...' : '🔍 Trouver mes cristaux'}
            </button>

            <button
              onClick={handleAI}
              disabled={aiLoading}
              className="w-full py-2.5 rounded-xl font-medium text-sm border border-violet-500/30 text-violet-300 hover:bg-violet-500/10 transition-all flex items-center justify-center gap-2"
            >
              {aiLoading ? '⏳ Génération...' : '🤖 Suggestion IA'}
            </button>
          </div>

          {/* Résultat IA */}
          {aiResult && (
            <div className="bg-stone-900 border border-violet-800/30 rounded-2xl p-5 animate-slide-up">
              <h3 className="font-semibold text-violet-300 mb-1">🤖 Recommandation IA</h3>
              <p className="text-xs text-stone-500 mb-3 italic">{aiResult.note}</p>
              <p className="text-sm text-stone-400 mb-3">{aiResult.message}</p>
              <div className="space-y-2">
                {aiResult.suggestions.map((s, i) => (
                  <div key={i} className="bg-stone-800 rounded-xl p-3">
                    <p className="text-sm font-medium text-stone-200">{s.crystal}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{s.reason}</p>
                    <span className="text-xs text-violet-400">Énergie : {s.energyLevel}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sélection courante */}
          <SelectedCrystalPreview
            selectedCrystals={selectedCrystals}
            crystals={crystals}
            onRemove={toggleSelect}
          />
        </div>

        {/* Catalogue filtré */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-stone-500 text-sm">
              {suggestions.length > 0
                ? `${suggestions.length} suggestion${suggestions.length > 1 ? 's' : ''} pour votre création`
                : `${displayed.length} cristaux disponibles`}
            </p>
            {suggestions.length > 0 && (
              <button
                onClick={() => setSuggestions([])}
                className="text-xs text-stone-400 hover:text-stone-200 underline"
              >
                Voir tous
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin text-4xl">💎</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayed.map(crystal => {
                const isSelected = selectedCrystals.includes(crystal.id);
                // Vérifier si ce cristal est incompatible avec un sélectionné
                const hasIncompatibility = selectedCrystals.some(selId => {
                  const selCrystal = crystals.find(c => c.id === selId);
                  return selCrystal?.incompatibleWith?.some(inc => inc.id === crystal.id);
                });

                return (
                  <div
                    key={crystal.id}
                    onClick={() => toggleSelect(crystal.id)}
                    className={`crystal-card relative cursor-pointer transition-all ${
                      isSelected ? 'border-violet-500 ring-2 ring-violet-500/30' : ''
                    } ${hasIncompatibility ? 'opacity-50' : ''}`}
                  >
                    {/* Sélection overlay */}
                    {isSelected && (
                      <div className="absolute top-2 left-2 z-10 bg-violet-600 text-white text-xs px-2 py-0.5 rounded-full">
                        ✓ Sélectionné
                      </div>
                    )}
                    {hasIncompatibility && (
                      <div className="absolute top-2 left-2 z-10 bg-red-900 text-red-300 text-xs px-2 py-0.5 rounded-full">
                        ⚠️ Incompatible
                      </div>
                    )}

                    {/* Image */}
                    <div
                      className="h-32 flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${crystal.color}33, ${crystal.color}11)` }}
                    >
                      <div
                        className="w-12 h-12 rounded-full"
                        style={{ backgroundColor: crystal.color, boxShadow: `0 0 20px ${crystal.color}66` }}
                      />
                    </div>

                    {/* Infos */}
                    <div className="p-3">
                      <p className="font-medium text-stone-100 text-sm">{crystal.name}</p>
                      {crystal.virtues?.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {crystal.virtues.slice(0, 2).map(v => (
                            <span key={v} className="text-xs bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded">
                              {v}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
