import { useEffect, useState } from 'react';
import useCrystalStore from '../store/useCrystalStore';
import { crystalApi } from '../services/api';

const COLORS = [
  { label: 'Violet', value: 'violet', hex: '#9B59B6' },
  { label: 'Rose',   value: 'rose',   hex: '#FFB6C1' },
  { label: 'Bleu',   value: 'bleu',   hex: '#26619C' },
  { label: 'Vert',   value: 'vert',   hex: '#4CAF50' },
  { label: 'Jaune',  value: 'jaune',  hex: '#F7C948' },
  { label: 'Orange', value: 'orange', hex: '#FF8C00' },
  { label: 'Rouge',  value: 'rouge',  hex: '#E74C3C' },
  { label: 'Noir',   value: 'noir',   hex: '#2C2C2C' },
  { label: 'Blanc',  value: 'blanc',  hex: '#F0F0F0' },
  { label: 'Marron', value: 'marron', hex: '#C8860A' },
];

const OBJECTIVES_PRESETS = [
  'Protection', 'Amour', 'Sérénité', 'Énergie', 'Méditation',
  'Confiance', 'Intuition', 'Créativité', 'Ancrage', 'Guérison',
];

function SelectionCard({ crystal, isSelected, isAI, hasIncompat, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        background: isSelected ? 'rgba(192,120,64,0.05)' : 'var(--bg-card)',
        border: `1.5px solid ${isSelected ? 'var(--copper)' : isAI ? 'rgba(192,120,64,0.4)' : 'var(--border)'}`,
        borderRadius: '1rem', overflow: 'hidden',
        cursor: 'pointer', transition: 'all 0.15s',
        opacity: hasIncompat ? 0.4 : 1,
        position: 'relative',
      }}
    >
      {/* Image */}
      <div style={{
        height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `radial-gradient(circle, ${crystal.color}33, ${crystal.color}11)`,
        position: 'relative',
      }}>
        {crystal.imageUrl ? (
          <img src={crystal.imageUrl} alt={crystal.name}
            style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: crystal.color, boxShadow: `0 0 22px ${crystal.color}66` }} />
        )}
        {/* Overlay sélection */}
        {isSelected && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(192,120,64,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '1.2rem', color: 'var(--copper)', filter: 'drop-shadow(0 0 4px rgba(192,120,64,0.6))' }}>✦</span>
          </div>
        )}
        {/* Badges */}
        <div style={{ position: 'absolute', top: '0.4rem', right: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-end' }}>
          {isAI && !isSelected && (
            <span style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--copper)', background: 'var(--bg-card)', border: '1px solid rgba(192,120,64,0.45)', borderRadius: '999px', padding: '0.08rem 0.38rem', fontFamily: "'Inter', sans-serif" }}>IA</span>
          )}
          {hasIncompat && (
            <span style={{ fontSize: '0.65rem', color: '#A03020', background: 'rgba(255,255,255,0.9)', borderRadius: '999px', padding: '0.05rem 0.3rem' }}>△</span>
          )}
        </div>
      </div>

      {/* Infos */}
      <div style={{ padding: '0.65rem 0.75rem 0.75rem' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.85rem', color: isSelected ? 'var(--copper)' : 'var(--text)', marginBottom: '0.3rem' }}>
          {crystal.name}
        </div>
        {crystal.virtues?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.22rem' }}>
            {crystal.virtues.slice(0, 2).map(v => (
              <span key={v} style={{ fontSize: '0.6rem', padding: '0.12rem 0.42rem', borderRadius: '999px', border: '1px solid var(--border)', color: 'var(--text-sec)', background: 'var(--bg)' }}>{v}</span>
            ))}
            {crystal.chakras?.[0] && (
              <span style={{ fontSize: '0.6rem', padding: '0.12rem 0.42rem', borderRadius: '999px', fontWeight: 500, backgroundColor: crystal.chakras[0].color + '18', color: crystal.chakras[0].color, border: `1px solid ${crystal.chakras[0].color}30` }}>
                ◯ {crystal.chakras[0].name}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const crBlock = { paddingTop: '1.75rem', paddingBottom: '1.75rem', borderBottom: '1px solid rgba(221,208,188,0.65)' };
const crLbl = { display: 'block', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.38rem' };
const crInp = { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.4rem 0.08rem', fontSize: '0.875rem', color: 'var(--text)', fontFamily: "'Inter', sans-serif", outline: 'none' };
const crSel = { ...crInp, appearance: 'none', cursor: 'pointer' };
const crTa = { width: '100%', background: 'rgba(237,224,208,0.28)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '0.6rem 0.75rem', fontSize: '0.875rem', color: 'var(--text)', fontFamily: "'Inter', sans-serif", outline: 'none', resize: 'none', lineHeight: 1.6 };

export default function Creator() {
  const { creationTypes, fetchCreationTypes, crystals, fetchCrystals } = useCrystalStore();
  const [form, setForm] = useState({ creationTypeId: '', color: '', objective: '' });
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCrystals, setSelectedCrystals] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    fetchCreationTypes();
    fetchCrystals({});
  }, []);

  const handleSearch = async () => {
    if (!form.creationTypeId && !form.color && !form.objective) return;
    setLoading(true);
    try {
      const results = await crystalApi.suggest({ color: form.color, objective: form.objective, creationTypeId: form.creationTypeId || undefined });
      setSuggestions(results);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAI = async () => {
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);
    try {
      const result = await crystalApi.generate({
        creationType: creationTypes.find(t => t.id === Number(form.creationTypeId))?.name,
        objective: form.objective,
        color: form.color,
      });
      setAiResult(result);
    } catch (err) {
      setAiError(err.message || 'Une erreur est survenue');
    } finally {
      setAiLoading(false);
    }
  };

  const toggleSelect = (id) => setSelectedCrystals(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  const addAllAI = () => {
    if (!aiResult?.suggestions) return;
    const newIds = aiResult.suggestions.map(s => s.crystalId).filter(id => !selectedCrystals.includes(id));
    setSelectedCrystals(prev => [...prev, ...newIds]);
  };

  const aiSuggestedIds = aiResult?.suggestions?.map(s => s.crystalId) || [];
  const displayed = suggestions.length > 0 ? suggestions : crystals;
  const selectedFull = crystals.filter(c => selectedCrystals.includes(c.id));

  const incompatibilities = [];
  for (const c of selectedFull) {
    for (const inc of (c.incompatibleWith || [])) {
      if (selectedCrystals.includes(inc.id)) {
        const pair = [c.name, inc.name].sort().join(' + ');
        if (!incompatibilities.includes(pair)) incompatibilities.push(pair);
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="eyebrow mb-2">⟡ &nbsp; Atelier</div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.85rem', color: 'var(--text)', marginBottom: '0.3rem' }}>
        Création artisanale
      </h1>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1rem', color: 'var(--text-dim)', marginBottom: '2rem' }}>
        Composez votre sélection de cristaux
      </p>
      <div className="divider-cel mb-6">✦ · · ✦ · · ✦</div>

      {/* Ligne principale : formulaire | grille de cristaux */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem', alignItems: 'start' }}>

        {/* Formulaire gauche */}
        <div>
          {/* Type */}
          <div style={{ ...crBlock, paddingTop: 0 }}>
            <div className="block-head">
              <span className="block-sym">⟡</span>
              <span className="block-ttl">Type de création</span>
              <span className="block-line" />
            </div>
            <label style={crLbl}>Création</label>
            <select value={form.creationTypeId} onChange={e => setForm(f => ({ ...f, creationTypeId: e.target.value }))} style={crSel}>
              <option value="">Sélectionner…</option>
              {creationTypes.map(t => <option key={t.id} value={t.id}>{t.icon} {t.name}</option>)}
            </select>
          </div>

          {/* Couleur */}
          <div style={crBlock}>
            <div className="block-head">
              <span className="block-sym">●</span>
              <span className="block-ttl">Couleur dominante</span>
              <span className="block-line" />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {COLORS.map(c => (
                <button
                  key={c.value}
                  onClick={() => setForm(f => ({ ...f, color: f.color === c.value ? '' : c.value }))}
                  title={c.label}
                  style={{
                    width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer',
                    border: form.color === c.value ? '2.5px solid var(--copper)' : '2px solid transparent',
                    backgroundColor: c.hex, outline: 'none', transition: 'all 0.15s',
                    transform: form.color === c.value ? 'scale(1.2)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Intention */}
          <div style={{ ...crBlock, borderBottom: 'none' }}>
            <div className="block-head">
              <span className="block-sym">∗</span>
              <span className="block-ttl">Intention</span>
              <span className="block-line" />
            </div>
            <label style={crLbl}>Objectif</label>
            <textarea
              style={crTa} rows={3}
              placeholder="Ex : protection, sérénité, amour…"
              value={form.objective}
              onChange={e => setForm(f => ({ ...f, objective: e.target.value }))}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
              {OBJECTIVES_PRESETS.map(obj => (
                <button
                  key={obj}
                  onClick={() => setForm(f => ({ ...f, objective: f.objective === obj ? '' : obj }))}
                  style={{
                    fontSize: '0.68rem', padding: '0.2rem 0.62rem', borderRadius: '999px',
                    cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.15s',
                    border: form.objective === obj ? '1px solid var(--copper)' : '1px solid var(--border)',
                    color: form.objective === obj ? 'var(--copper)' : 'var(--text-sec)',
                    background: form.objective === obj ? 'rgba(192,120,64,0.08)' : 'transparent',
                  }}
                >
                  {obj}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', paddingTop: '1.5rem' }}>
            <button onClick={handleSearch} disabled={loading} className="btn-primary" style={{ justifyContent: 'center' }}>
              {loading ? '· · ·' : '⊙ Trouver mes cristaux'}
            </button>
            <button onClick={handleAI} disabled={aiLoading} className="btn-ghost" style={{ justifyContent: 'center' }}>
              {aiLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--amber)', letterSpacing: '0.2rem' }}>✦ · ✦</span>
                  Gemini réfléchit…
                </span>
              ) : '✦ Suggestion IA'}
            </button>
          </div>

          {/* Erreur IA */}
          {aiError && (
            <div style={{ marginTop: '1rem', background: 'rgba(160,50,30,0.07)', border: '1px solid rgba(160,50,30,0.2)', borderRadius: '0.75rem', padding: '0.75rem 0.9rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#A03020' }}>△ {aiError}</p>
            </div>
          )}

          {/* Résultat IA */}
          {aiResult && (
            <div style={{ marginTop: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1rem 1.1rem' }}>
              <div className="dsec-title" style={{ marginBottom: '0.5rem' }}><span>∗</span> Recommandation IA</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-sec)', marginBottom: '0.85rem', lineHeight: 1.6 }}>{aiResult.message}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {aiResult.suggestions?.map((s, i) => {
                  const isAdded = selectedCrystals.includes(s.crystalId);
                  return (
                    <div key={i} style={{
                      background: isAdded ? 'rgba(192,120,64,0.06)' : 'var(--bg)',
                      border: `1px solid ${isAdded ? 'rgba(192,120,64,0.35)' : 'transparent'}`,
                      borderRadius: '0.75rem', padding: '0.55rem 0.65rem',
                      display: 'flex', alignItems: 'flex-start', gap: '0.55rem',
                      transition: 'all 0.15s',
                    }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text)', fontFamily: "'Playfair Display', serif" }}>{s.crystalName}</p>
                        <p style={{ fontSize: '0.71rem', color: 'var(--text-dim)', marginTop: '0.12rem', lineHeight: 1.5 }}>{s.reason}</p>
                      </div>
                      <button
                        onClick={() => toggleSelect(s.crystalId)}
                        title={isAdded ? 'Retirer de la sélection' : 'Ajouter à la sélection'}
                        style={{
                          flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%',
                          border: `1.5px solid ${isAdded ? 'var(--copper)' : 'rgba(192,120,64,0.5)'}`,
                          background: isAdded ? 'var(--copper)' : 'transparent',
                          color: isAdded ? '#fff' : 'var(--copper)',
                          cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s', lineHeight: 1,
                        }}
                      >
                        {isAdded ? '✓' : '+'}
                      </button>
                    </div>
                  );
                })}
              </div>
              {aiResult.suggestions?.length > 1 && (
                <button
                  onClick={addAllAI}
                  disabled={aiResult.suggestions.every(s => selectedCrystals.includes(s.crystalId))}
                  className="btn-secondary"
                  style={{ marginTop: '0.85rem', width: '100%', justifyContent: 'center', fontSize: '0.75rem' }}
                >
                  Tout ajouter à la sélection
                </button>
              )}
            </div>
          )}
        </div>

        {/* Grille de cristaux droite */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--amber)' }}>✦</span>
              {suggestions.length > 0
                ? `${suggestions.length} suggestion${suggestions.length > 1 ? 's' : ''}`
                : `${crystals.length} cristaux disponibles`}
            </div>
            {suggestions.length > 0 && (
              <button onClick={() => setSuggestions([])} style={{ fontSize: '0.72rem', color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px', fontFamily: "'Inter', sans-serif" }}>
                Voir tous
              </button>
            )}
          </div>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '12rem' }}>
              <span style={{ color: 'var(--amber)', fontSize: '1.2rem', letterSpacing: '0.4rem' }}>✦ · · ✦</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayed.map(crystal => {
                const isSelected = selectedCrystals.includes(crystal.id);
                const isAI = aiSuggestedIds.includes(crystal.id);
                const hasIncompat = selectedCrystals.some(selId => {
                  const s = crystals.find(c => c.id === selId);
                  return s?.incompatibleWith?.some(inc => inc.id === crystal.id);
                });
                return (
                  <SelectionCard
                    key={crystal.id}
                    crystal={crystal}
                    isSelected={isSelected}
                    isAI={isAI}
                    hasIncompat={hasIncompat}
                    onToggle={() => toggleSelect(crystal.id)}
                  />
                );
              })}
            </div>
          )}

          {/* Ma sélection — sous la grille, visible dès qu'un cristal est sélectionné */}
          {selectedFull.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <div style={{
              background: 'var(--bg-card)', border: '1.5px solid var(--border)',
              borderRadius: '1.5rem', padding: '1.75rem 2rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.35rem', color: 'var(--text)' }}>
                    ◇ Ma sélection
                  </h2>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    {selectedFull.length} cristal{selectedFull.length > 1 ? 'x' : ''}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCrystals([])}
                  style={{ fontSize: '0.72rem', color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px', fontFamily: "'Inter', sans-serif" }}
                >
                  Tout effacer
                </button>
              </div>

                  {/* Aperçu orbes */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {selectedFull.map(c => (
                      <div key={c.id} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: c.color, boxShadow: `0 0 12px ${c.color}55`, flexShrink: 0 }} title={c.name} />
                    ))}
                  </div>

                  {/* Grille des cristaux sélectionnés */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {selectedFull.map(crystal => (
                      <div
                        key={crystal.id}
                        style={{
                          background: 'var(--bg)', border: '1px solid rgba(192,120,64,0.3)',
                          borderRadius: '0.875rem', overflow: 'hidden',
                        }}
                      >
                        <div style={{
                          height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: `radial-gradient(circle, ${crystal.color}33, ${crystal.color}11)`,
                        }}>
                          {crystal.imageUrl ? (
                            <img src={crystal.imageUrl} alt={crystal.name}
                              style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: crystal.color, boxShadow: `0 0 16px ${crystal.color}66` }} />
                          )}
                        </div>
                        <div style={{ padding: '0.5rem 0.6rem 0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.78rem', color: 'var(--text)' }}>{crystal.name}</span>
                          <button
                            onClick={() => toggleSelect(crystal.id)}
                            title="Retirer"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '0.65rem', padding: '0', lineHeight: 1, flexShrink: 0 }}
                          >✕</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Incompatibilités */}
                  {incompatibilities.length > 0 && (
                    <div style={{ marginTop: '1.25rem', background: 'rgba(160,50,30,0.07)', border: '1px solid rgba(160,50,30,0.2)', borderRadius: '0.875rem', padding: '0.85rem 1rem' }}>
                      <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#A03020', marginBottom: '0.35rem' }}>△ Incompatibilités détectées</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {incompatibilities.map(pair => (
                          <span key={pair} style={{ fontSize: '0.7rem', color: '#A03020', background: 'rgba(160,50,30,0.09)', borderRadius: '999px', padding: '0.15rem 0.65rem', border: '1px solid rgba(160,50,30,0.18)' }}>
                            {pair}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
