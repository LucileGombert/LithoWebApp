import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crystalApi, chakraApi, zodiacApi } from '../services/api';

const emptyForm = {
  name: '', color: '#8B5CF6', imageUrl: '', colors: [], description: '',
  virtues: [], properties: [], origin: '', chakras: [], zodiacSigns: [],
  precautions: [],
  stock: { perlesCailloux: 0, perles2mm: 0, perles4mm: 0, perles6mm: 0, pierresRoulees: 0, pierresBrutes: 0 },
};

const CHAKRA_NAMES = ['Racine', 'Sacré', 'Plexus Solaire', 'Cœur', 'Gorge', 'Troisième Œil', 'Couronne'];
const ZODIAC_NAMES = ['Bélier', 'Taureau', 'Gémeaux', 'Cancer', 'Lion', 'Vierge', 'Balance', 'Scorpion', 'Sagittaire', 'Capricorne', 'Verseau', 'Poissons'];

const CHAKRA_COLORS = {
  'Racine':         { border: '#CC3333', bg: 'rgba(204,51,51,0.09)',   def: 'rgba(204,51,51,0.38)' },
  'Sacré':          { border: '#CC7000', bg: 'rgba(204,112,0,0.09)',   def: 'rgba(204,112,0,0.38)' },
  'Plexus Solaire': { border: '#B8900A', bg: 'rgba(184,144,10,0.10)',  def: 'rgba(184,144,10,0.38)' },
  'Cœur':           { border: '#2E7D42', bg: 'rgba(46,125,66,0.09)',   def: 'rgba(46,125,66,0.38)' },
  'Gorge':          { border: '#007B8A', bg: 'rgba(0,123,138,0.09)',   def: 'rgba(0,123,138,0.38)' },
  'Troisième Œil':  { border: '#2A3C9E', bg: 'rgba(42,60,158,0.09)',   def: 'rgba(42,60,158,0.38)' },
  'Couronne':       { border: '#7A1F8C', bg: 'rgba(122,31,140,0.09)',  def: 'rgba(122,31,140,0.38)' },
};

function TagInput({ values, onChange, placeholder }) {
  const [input, setInput] = useState('');
  function add() {
    const v = input.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput('');
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
      {values.map(tag => (
        <span key={tag} className="atag">
          {tag}
          <button type="button" className="atag-x" onClick={() => onChange(values.filter(t => t !== tag))}>×</button>
        </span>
      ))}
      <input
        type="text" value={input} onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
        placeholder={placeholder}
        style={{ fontSize: '0.68rem', padding: '0.2rem 0.62rem', borderRadius: '999px', border: '1px dashed var(--border)', color: 'var(--text-dim)', background: 'transparent', outline: 'none', fontFamily: "'Inter', sans-serif", minWidth: '80px' }}
        onBlur={add}
      />
    </div>
  );
}

const STOCK_KEYS = [
  { key: 'perlesCailloux', label: 'Perles cailloux' },
  { key: 'perles2mm',      label: 'Perles 2mm' },
  { key: 'perles4mm',      label: 'Perles 4mm' },
  { key: 'perles6mm',      label: 'Perles 6mm' },
  { key: 'pierresRoulees', label: 'Pierres roulées' },
  { key: 'pierresBrutes',  label: 'Pierres brutes' },
];

const ablock = { padding: '2.25rem 0' };

export default function AddCrystal() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('auto');
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

  function field(key, value) { setForm(f => ({ ...f, [key]: value })); }

  async function handleResearch() {
    if (!crystalName.trim()) { setError('Veuillez saisir le nom du cristal.'); return; }
    setError(''); setLoading(true);
    try {
      const urls = sourceUrls.filter(u => u.trim());
      const data = await crystalApi.research({ name: crystalName.trim(), mode, urls: mode === 'semi-auto' ? urls : undefined });
      setForm({
        name: data.name ?? crystalName, color: data.color ?? '#8B5CF6',
        imageUrl: data.imageUrl ?? '', colors: data.colors ?? [],
        description: data.description ?? '', virtues: data.virtues ?? [],
        properties: data.properties ?? [], origin: data.origin ?? '',
        chakras: data.chakras ?? [], zodiacSigns: data.zodiacSigns ?? [],
        precautions: data.precautions ?? [],
        stock: { perlesCailloux: 0, perles2mm: 0, perles4mm: 0, perles6mm: 0, pierresRoulees: 0, pierresBrutes: 0 },
      });
      setShowForm(true);
    } catch (err) { setError(err.message || 'Erreur lors de la recherche.'); }
    finally { setLoading(false); }
  }

  function handleManual() { setForm({ ...emptyForm, name: crystalName }); setShowForm(true); setError(''); }

  async function handleSave() {
    if (!form.name.trim()) { setError('Le nom du cristal est requis.'); return; }
    if (!form.color) { setError('La couleur principale est requise.'); return; }
    setSaving(true); setError('');
    try {
      const chakraIds = chakras.filter(c => form.chakras.includes(c.name)).map(c => c.id);
      const zodiacIds = zodiacs.filter(z => form.zodiacSigns.includes(z.name)).map(z => z.id);
      const created = await crystalApi.create({
        name: form.name.trim(), color: form.color, imageUrl: form.imageUrl || null,
        colors: form.colors, description: form.description, virtues: form.virtues,
        properties: form.properties, hardness: null, origin: form.origin || null,
        chakraIds, zodiacIds, precautions: form.precautions, stock: form.stock,
      });
      navigate(`/crystals/${created.id}`);
    } catch (err) { setError(err.message || 'Erreur lors de la sauvegarde.'); }
    finally { setSaving(false); }
  }

  function updateUrl(i, v) { setSourceUrls(prev => prev.map((u, j) => j === i ? v : u)); }
  function addUrl() { setSourceUrls(prev => [...prev, '']); }
  function removeUrl(i) { setSourceUrls(prev => prev.filter((_, j) => j !== i)); }

  const chakraOpts = chakras.length ? chakras.map(c => c.name) : CHAKRA_NAMES;
  const zodiacOpts = zodiacs.length ? zodiacs.map(z => z.name) : ZODIAC_NAMES;

  const tabStyle = (key) => ({
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.22rem',
    padding: '0.82rem 0.5rem 0.7rem', background: 'none', border: 'none', cursor: 'pointer',
    color: mode === key ? 'var(--copper)' : 'var(--text-dim)',
    fontFamily: "'Inter', sans-serif", position: 'relative',
    borderBottom: mode === key ? '1.5px solid var(--copper)' : '1px solid var(--border)',
  });

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
      {/* En-tête */}
      <div className="eyebrow" style={{ textAlign: 'center', marginBottom: '0.55rem' }}>✦ &nbsp; Bibliothèque &nbsp; ✦</div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.95rem', color: 'var(--text)', textAlign: 'center', marginBottom: '0.4rem' }}>
        Ajouter un cristal
      </h1>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1rem', color: 'var(--text-dim)', textAlign: 'center', marginBottom: '1.75rem' }}>
        Choisissez votre méthode de création
      </p>

      {/* Onglets de mode */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '0' }}>
        {[
          { key: 'auto',      ico: '✦', lbl: 'Automatique',      sub: 'Wikipedia + Gemini' },
          { key: 'semi-auto', ico: '⟡', lbl: 'Semi-automatique', sub: 'Vos sources + Gemini' },
          { key: 'manual',    ico: '✐', lbl: 'Manuel',            sub: 'Saisie libre' },
        ].map(m => (
          <button key={m.key} style={tabStyle(m.key)}
            onClick={() => { setMode(m.key); setShowForm(m.key === 'manual'); setError(''); }}>
            <span style={{ fontSize: '0.95rem' }}>{m.ico}</span>
            <span style={{ fontSize: '0.73rem', fontWeight: 500 }}>{m.lbl}</span>
            <span style={{ fontSize: '0.6rem', opacity: 0.75 }}>{m.sub}</span>
          </button>
        ))}
      </div>

      {/* Nom du cristal */}
      <div style={{ textAlign: 'center', margin: '1.75rem 0 0.5rem' }}>
        <input
          value={crystalName}
          onChange={e => { setCrystalName(e.target.value); if (showForm) field('name', e.target.value); }}
          placeholder="Nom du cristal…"
          style={{
            width: '100%', background: 'transparent', border: 'none',
            borderBottom: '1.5px solid var(--border)', padding: '0.5rem 0.25rem',
            fontFamily: "'Playfair Display', serif", fontSize: '1.45rem',
            color: 'var(--text)', textAlign: 'center', outline: 'none',
          }}
        />
        <p style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.35rem', letterSpacing: '0.04em' }}>
          Saisissez le nom du cristal avant de lancer la recherche
        </p>
      </div>

      {/* Zone d'action (avant la saisie du formulaire) */}
      {!showForm && (
        <div style={{ margin: '1.5rem 0' }}>
          {mode === 'auto' && (
            <button type="button" onClick={handleResearch} disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
              {loading ? <><span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid #FFF8F0', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Recherche en cours…</> : '⊙ Lancer la recherche automatique'}
            </button>
          )}
          {mode === 'semi-auto' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Collez les liens des pages sources à analyser</p>
              {sourceUrls.map((url, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="url" value={url} onChange={e => updateUrl(i, e.target.value)}
                    placeholder={`https://exemple.com/cristal-${i + 1}`} className="field-inp" style={{ flex: 1 }} />
                  {sourceUrls.length > 1 && (
                    <button type="button" onClick={() => removeUrl(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '0.8rem' }}>✕</button>
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={addUrl} className="btn-secondary" style={{ fontSize: '0.75rem' }}>+ Ajouter une source</button>
                <button type="button" onClick={handleResearch} disabled={loading} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {loading ? '· · ·' : '⟡ Analyser les sources'}
                </button>
              </div>
            </div>
          )}
          {mode === 'manual' && (
            <button type="button" onClick={handleManual} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
              ✐ Ouvrir le formulaire
            </button>
          )}
        </div>
      )}

      {error && (
        <div style={{ margin: '1rem 0', padding: '0.75rem 1rem', background: 'rgba(160,50,30,0.07)', border: '1px solid rgba(160,50,30,0.22)', borderRadius: '0.75rem', color: '#A03020', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {/* Formulaire aérien */}
      {showForm && (
        <>
          <div className="divider-cel" style={{ margin: '1.5rem 0 0' }}>✦ · · ✦ · · ✦</div>

          {/* ◆ Identité */}
          <div style={ablock}>
            <div className="block-head"><span className="block-sym">✦</span><span className="block-ttl">Identité</span><span className="block-line" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.4rem' }}>
              <div>
                <label className="field-lbl">Couleur principale</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <input type="color" value={form.color} onChange={e => field('color', e.target.value)}
                    style={{ height: '32px', width: '44px', borderRadius: '0.375rem', cursor: 'pointer', background: 'transparent', border: '1px solid var(--border)' }} />
                  <input type="text" value={form.color} onChange={e => field('color', e.target.value)} className="field-inp" style={{ flex: 1 }} />
                </div>
              </div>
              <div>
                <label className="field-lbl">Origine</label>
                <input type="text" value={form.origin} onChange={e => field('origin', e.target.value)} placeholder="Finlande, Madagascar…" className="field-inp" />
              </div>
            </div>
            <div style={{ marginBottom: '1.4rem' }}>
              <label className="field-lbl">Description</label>
              <textarea value={form.description} onChange={e => field('description', e.target.value)} rows={3} className="field-area" placeholder="Décrivez les propriétés lithothérapeutiques du cristal…" />
            </div>
            <div>
              <label className="field-lbl">Image — URL</label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <input type="url" value={form.imageUrl} onChange={e => field('imageUrl', e.target.value)} placeholder="https://…" className="field-inp" style={{ flex: 1 }} />
                {form.imageUrl && (
                  <img src={form.imageUrl} alt="Aperçu" style={{ height: '52px', width: '52px', borderRadius: '0.5rem', objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }}
                    onError={e => { e.target.style.display = 'none'; }} />
                )}
              </div>
              {!form.imageUrl && (
                <div style={{ height: '52px', borderRadius: '0.5rem', background: 'rgba(237,224,208,0.32)', border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.45rem', letterSpacing: '0.04em' }}>
                  aperçu de l'image
                </div>
              )}
            </div>
          </div>

          <div className="block-sep">◦ &nbsp; ◦ &nbsp; ◦</div>

          {/* ◆ Vertus */}
          <div style={ablock}>
            <div className="block-head"><span className="block-sym">☽</span><span className="block-ttl">Vertus &amp; Propriétés</span><span className="block-line" /></div>
            <div style={{ marginBottom: '1.4rem' }}>
              <label className="field-lbl">Vertus</label>
              <TagInput values={form.virtues} onChange={v => field('virtues', v)} placeholder="+ vertu" />
            </div>
            <div style={{ marginBottom: '1.4rem' }}>
              <label className="field-lbl">Propriétés générales</label>
              <TagInput values={form.properties} onChange={v => field('properties', v)} placeholder="+ propriété" />
            </div>
            <div>
              <label className="field-lbl">Précautions</label>
              <TagInput values={form.precautions} onChange={v => field('precautions', v)} placeholder="+ précaution" />
            </div>
          </div>

          <div className="block-sep">◦ &nbsp; ◦ &nbsp; ◦</div>

          {/* ◆ Énergies */}
          <div style={ablock}>
            <div className="block-head"><span className="block-sym">◯</span><span className="block-ttl">Énergies</span><span className="block-line" /></div>
            <div style={{ marginBottom: '1.4rem' }}>
              <label className="field-lbl">Chakras associés</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.35rem' }}>
                {chakraOpts.map(opt => {
                  const on = form.chakras.includes(opt);
                  const c = CHAKRA_COLORS[opt] || {};
                  return (
                    <button key={opt} type="button"
                      onClick={() => field('chakras', on ? form.chakras.filter(x => x !== opt) : [...form.chakras, opt])}
                      style={{
                        fontSize: '0.68rem', padding: '0.26rem 0.72rem', borderRadius: '999px',
                        cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.15s',
                        border: on ? `1px solid ${c.border}` : `1px solid ${c.def || 'var(--border)'}`,
                        color: on ? c.border : (c.def ? c.border + 'CC' : 'var(--text-sec)'),
                        background: on ? c.bg : 'transparent',
                      }}
                    >{opt}</button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="field-lbl">Signes du zodiaque</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.35rem' }}>
                {zodiacOpts.map(opt => {
                  const on = form.zodiacSigns.includes(opt);
                  return (
                    <button key={opt} type="button"
                      onClick={() => field('zodiacSigns', on ? form.zodiacSigns.filter(x => x !== opt) : [...form.zodiacSigns, opt])}
                      style={{
                        fontSize: '0.68rem', padding: '0.26rem 0.72rem', borderRadius: '999px',
                        cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.15s',
                        border: on ? '1px solid var(--copper)' : '1px solid var(--border)',
                        color: on ? 'var(--copper)' : 'var(--text-sec)',
                        background: on ? 'rgba(192,120,64,0.08)' : 'transparent',
                      }}
                    >{opt}</button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="block-sep">◦ &nbsp; ◦ &nbsp; ◦</div>

          {/* ◆ Stock */}
          <div style={ablock}>
            <div className="block-head"><span className="block-sym">◇</span><span className="block-ttl">Stock initial</span><span className="block-line" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.2rem' }}>
              {STOCK_KEYS.map(({ key, label }) => (
                <div key={key} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.28rem' }}>{label}</div>
                  <input type="number" min="0" value={form.stock[key]}
                    onChange={e => field('stock', { ...form.stock, [key]: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', textAlign: 'center', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.28rem', fontSize: '1rem', color: 'var(--text)', fontFamily: "'Playfair Display', serif", outline: 'none' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Boutons */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem', marginTop: '2.75rem' }}>
            <button type="button" onClick={handleSave} disabled={saving} className="btn-save">
              {saving ? '· · ·' : '✦  Enregistrer le cristal  ✦'}
            </button>
            <button type="button" onClick={() => navigate('/')} style={{ fontSize: '0.76rem', color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px', textDecorationColor: 'var(--border)', fontFamily: "'Inter', sans-serif" }}>
              Annuler
            </button>
          </div>

          <div style={{ textAlign: 'center', color: 'var(--ocre)', fontSize: '0.85rem', letterSpacing: '0.38rem', opacity: 0.52, marginTop: '2.5rem' }}>✦ · · · ✦ · · · ✦</div>
        </>
      )}
    </div>
  );
}
