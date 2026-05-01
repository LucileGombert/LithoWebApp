import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useCrystalStore from '../store/useCrystalStore';
import useFavoritesStore from '../store/useFavoritesStore';
import { crystalApi, chakraApi, zodiacApi } from '../services/api';

const STOCK_CATEGORIES = [
  { key: 'perlesCailloux', label: 'Perles Cailloux' },
  { key: 'perles2mm',      label: 'Perles 2mm' },
  { key: 'perles4mm',      label: 'Perles 4mm' },
  { key: 'perles6mm',      label: 'Perles 6mm' },
  { key: 'pierresRoulees', label: 'Pierres Roulées' },
  { key: 'pierresBrutes',  label: 'Pierres Brutes' },
];

const CHAKRA_NAMES = ['Racine', 'Sacré', 'Plexus Solaire', 'Cœur', 'Gorge', 'Troisième Œil', 'Couronne'];
const ZODIAC_NAMES = ['Bélier', 'Taureau', 'Gémeaux', 'Cancer', 'Lion', 'Vierge', 'Balance', 'Scorpion', 'Sagittaire', 'Capricorne', 'Verseau', 'Poissons'];

const CHAKRA_COLORS = {
  'Racine':         { border: '#CC3333', bg: 'rgba(204,51,51,0.09)' },
  'Sacré':          { border: '#CC7000', bg: 'rgba(204,112,0,0.09)' },
  'Plexus Solaire': { border: '#B8900A', bg: 'rgba(184,144,10,0.10)' },
  'Cœur':           { border: '#2E7D42', bg: 'rgba(46,125,66,0.09)' },
  'Gorge':          { border: '#007B8A', bg: 'rgba(0,123,138,0.09)' },
  'Troisième Œil':  { border: '#2A3C9E', bg: 'rgba(42,60,158,0.09)' },
  'Couronne':       { border: '#7A1F8C', bg: 'rgba(122,31,140,0.09)' },
};

function TagInput({ label, values, onChange, placeholder }) {
  const [input, setInput] = useState('');
  function add() {
    const v = input.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput('');
  }
  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <label className="field-lbl">{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
        {values.map(tag => (
          <span key={tag} className="atag">
            {tag}
            <button type="button" className="atag-x" onClick={() => onChange(values.filter(t => t !== tag))}>×</button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder} className="field-inp" style={{ flex: 1 }} />
        <button type="button" onClick={add} className="btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}>+</button>
      </div>
    </div>
  );
}

function ChakraSelect({ options, selected, onChange }) {
  const toggle = v => onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
      {options.map(opt => {
        const on = selected.includes(opt);
        const c = CHAKRA_COLORS[opt] || {};
        return (
          <button key={opt} type="button" onClick={() => toggle(opt)} style={{
            fontSize: '0.68rem', padding: '0.26rem 0.72rem', borderRadius: '999px',
            cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.15s',
            border: on ? `1px solid ${c.border}` : `1px solid ${c.border ? c.border + '55' : 'var(--border)'}`,
            color: on ? c.border : (c.border ? c.border + 'BB' : 'var(--text-sec)'),
            background: on ? c.bg : 'transparent',
          }}>{opt}</button>
        );
      })}
    </div>
  );
}

function ZodiacSelect({ options, selected, onChange }) {
  const toggle = v => onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
      {options.map(opt => {
        const on = selected.includes(opt);
        return (
          <button key={opt} type="button" onClick={() => toggle(opt)} style={{
            fontSize: '0.68rem', padding: '0.26rem 0.72rem', borderRadius: '999px',
            cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.15s',
            border: on ? '1px solid var(--copper)' : '1px solid var(--border)',
            color: on ? 'var(--copper)' : 'var(--text-sec)',
            background: on ? 'rgba(192,120,64,0.08)' : 'transparent',
          }}>{opt}</button>
        );
      })}
    </div>
  );
}

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
      name: crystal.name, imageUrl: crystal.imageUrl || '', color: crystal.color,
      colors: crystal.colors || [], description: crystal.description || '',
      virtues: crystal.virtues || [], properties: crystal.properties || [],
      origin: crystal.origin || '',
      chakras: crystal.chakras?.map(c => c.name) || [],
      zodiacSigns: crystal.zodiacSigns?.map(z => z.name) || [],
      precautions: crystal.precautions?.map(p => p.description) || [],
      stock: crystal.stock ? {
        perlesCailloux: crystal.stock.perlesCailloux ?? 0, perles2mm: crystal.stock.perles2mm ?? 0,
        perles4mm: crystal.stock.perles4mm ?? 0, perles6mm: crystal.stock.perles6mm ?? 0,
        pierresRoulees: crystal.stock.pierresRoulees ?? 0, pierresBrutes: crystal.stock.pierresBrutes ?? 0,
      } : { perlesCailloux: 0, perles2mm: 0, perles4mm: 0, perles6mm: 0, pierresRoulees: 0, pierresBrutes: 0 },
    });
    setIsEditing(true); setEditError('');
  }

  function field(key, value) { setEditForm(f => ({ ...f, [key]: value })); }

  async function handleSave() {
    if (!editForm.name.trim()) { setEditError('Le nom est requis.'); return; }
    setSaving(true); setEditError('');
    try {
      const chakraIds = chakras.filter(c => editForm.chakras.includes(c.name)).map(c => c.id);
      const zodiacIds = zodiacs.filter(z => editForm.zodiacSigns.includes(z.name)).map(z => z.id);
      await crystalApi.update(id, {
        name: editForm.name.trim(), imageUrl: editForm.imageUrl || null,
        color: editForm.color, colors: editForm.colors, description: editForm.description,
        virtues: editForm.virtues, properties: editForm.properties, hardness: null,
        origin: editForm.origin || null, chakraIds, zodiacIds, precautions: editForm.precautions,
      });
      await crystalApi.updateStock(id, editForm.stock);
      await fetchCrystalById(id);
      setIsEditing(false);
    } catch (err) {
      setEditError(err.message || 'Erreur lors de la sauvegarde.');
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!window.confirm(`Supprimer "${crystal.name}" définitivement ?`)) return;
    setDeleting(true);
    try { await crystalApi.delete(id); navigate('/'); }
    catch (err) { alert('Erreur : ' + err.message); setDeleting(false); }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '16rem' }}>
      <span style={{ color: 'var(--amber)', fontSize: '1.2rem', letterSpacing: '0.4rem' }}>✦ · · ✦</span>
    </div>
  );

  if (error || !crystal) return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div style={{ background: 'rgba(160,50,30,0.07)', border: '1px solid rgba(160,50,30,0.22)', borderRadius: '1rem', padding: '1rem', color: '#A03020' }}>Cristal non trouvé</div>
      <Link to="/" className="btn-secondary" style={{ display: 'inline-flex', marginTop: '1rem' }}>← Retour</Link>
    </div>
  );

  const fav = isFavorite(crystal.id);

  // ── Mode édition ─────────────────────────────────────────────────────────

  if (isEditing && editForm) {
    const chakraOpts = chakras.length ? chakras.map(c => c.name) : CHAKRA_NAMES;
    const zodiacOpts = zodiacs.length ? zodiacs.map(z => z.name) : ZODIAC_NAMES;
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
            <Link to="/" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Bibliothèque</Link>
            {' / '}<span style={{ color: 'var(--text-sec)' }}>{crystal.name}</span>
            {' / '}<span style={{ color: 'var(--copper)' }}>Édition</span>
          </div>
          <button onClick={() => setIsEditing(false)} className="btn-secondary" style={{ fontSize: '0.75rem' }}>✕ Annuler</button>
        </div>

        <div style={{ paddingBottom: '2rem' }}>
          <div className="block-head"><span className="block-sym">✦</span><span className="block-ttl">Identité</span><span className="block-line" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.4rem' }}>
            <div><label className="field-lbl">Nom *</label><input type="text" value={editForm.name} onChange={e => field('name', e.target.value)} className="field-inp" /></div>
            <div>
              <label className="field-lbl">Couleur principale</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="color" value={editForm.color} onChange={e => field('color', e.target.value)} style={{ height: '36px', width: '52px', borderRadius: '0.375rem', cursor: 'pointer', background: 'transparent', border: '1px solid var(--border)' }} />
                <input type="text" value={editForm.color} onChange={e => field('color', e.target.value)} className="field-inp" style={{ flex: 1 }} />
              </div>
            </div>
          </div>
          <div style={{ marginBottom: '1.4rem' }}>
            <label className="field-lbl">URL de l'image</label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <input type="url" value={editForm.imageUrl} onChange={e => field('imageUrl', e.target.value)} placeholder="https://…" className="field-inp" style={{ flex: 1 }} />
              {editForm.imageUrl && <img src={editForm.imageUrl} alt="Aperçu" style={{ height: '52px', width: '52px', borderRadius: '0.5rem', objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }} onError={e => { e.target.style.display = 'none'; }} />}
            </div>
          </div>
          <div style={{ marginBottom: '1.4rem' }}><label className="field-lbl">Description</label><textarea value={editForm.description} onChange={e => field('description', e.target.value)} rows={3} className="field-area" placeholder="Propriétés lithothérapeutiques…" /></div>
          <div><label className="field-lbl">Origine</label><input type="text" value={editForm.origin} onChange={e => field('origin', e.target.value)} placeholder="Ex: Brésil, Madagascar…" className="field-inp" /></div>
        </div>

        <div className="block-sep">◦ &nbsp; ◦ &nbsp; ◦</div>

        <div style={{ padding: '2rem 0' }}>
          <div className="block-head"><span className="block-sym">☽</span><span className="block-ttl">Vertus &amp; Propriétés</span><span className="block-line" /></div>
          <TagInput label="Vertus" values={editForm.virtues} onChange={v => field('virtues', v)} placeholder="Ex: Protection" />
          <TagInput label="Propriétés générales" values={editForm.properties} onChange={v => field('properties', v)} placeholder="Ex: Pierre de méditation" />
          <TagInput label="Précautions" values={editForm.precautions} onChange={v => field('precautions', v)} placeholder="Ex: Sensible à l'eau" />
        </div>

        <div className="block-sep">◦ &nbsp; ◦ &nbsp; ◦</div>

        <div style={{ padding: '2rem 0' }}>
          <div className="block-head"><span className="block-sym">◯</span><span className="block-ttl">Énergies</span><span className="block-line" /></div>
          <div style={{ marginBottom: '1.1rem' }}>
            <label className="field-lbl" style={{ marginBottom: '0.5rem' }}>Chakras associés</label>
            <ChakraSelect options={chakraOpts} selected={editForm.chakras} onChange={v => field('chakras', v)} />
          </div>
          <div>
            <label className="field-lbl" style={{ marginBottom: '0.5rem' }}>Signes du zodiaque</label>
            <ZodiacSelect options={zodiacOpts} selected={editForm.zodiacSigns} onChange={v => field('zodiacSigns', v)} />
          </div>
        </div>

        <div className="block-sep">◦ &nbsp; ◦ &nbsp; ◦</div>

        <div style={{ paddingTop: '2rem' }}>
          <div className="block-head"><span className="block-sym">◇</span><span className="block-ttl">Stock</span><span className="block-line" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.2rem' }}>
            {STOCK_CATEGORIES.map(({ key, label }) => (
              <div key={key} style={{ textAlign: 'center' }}>
                <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.28rem' }}>{label}</label>
                <input type="number" min="0" value={editForm.stock[key]}
                  onChange={e => field('stock', { ...editForm.stock, [key]: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', textAlign: 'center', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.28rem', fontSize: '1rem', color: 'var(--text)', fontFamily: "'Playfair Display', serif", outline: 'none' }} />
              </div>
            ))}
          </div>
        </div>

        {editError && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(160,50,30,0.07)', border: '1px solid rgba(160,50,30,0.22)', borderRadius: '0.75rem', color: '#A03020', fontSize: '0.875rem' }}>{editError}</div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem', marginTop: '2.5rem' }}>
          <button onClick={handleSave} disabled={saving} className="btn-save">
            {saving ? '· · ·' : '✦  Enregistrer les modifications  ✦'}
          </button>
          <button onClick={() => setIsEditing(false)} style={{ fontSize: '0.76rem', color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px', textDecorationColor: 'var(--border)', fontFamily: "'Inter', sans-serif" }}>Annuler</button>
        </div>
      </div>
    );
  }

  // ── Mode affichage ───────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
          <Link to="/" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Bibliothèque</Link>
          {' / '}<span style={{ color: 'var(--text-sec)' }}>{crystal.name}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.45rem' }}>
          <button onClick={startEditing} className="btn-secondary" style={{ fontSize: '0.76rem' }}>Modifier</button>
          <button onClick={handleDelete} disabled={deleting} className="btn-danger" style={{ fontSize: '0.76rem' }}>
            {deleting ? '· · ·' : '✕ Supprimer'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '2rem' }}>
        {/* Gauche */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          <div style={{
            borderRadius: '1.25rem', height: '255px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
            background: `radial-gradient(circle, ${crystal.color}44, ${crystal.color}11)`,
          }}>
            {crystal.imageUrl ? (
              <img src={crystal.imageUrl} alt={crystal.name} style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
            ) : (
              <>
                <span style={{ position: 'absolute', top: '1rem', left: '1rem', color: 'var(--amber)', opacity: 0.45, fontSize: '0.72rem' }}>✦</span>
                <div style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: crystal.color, boxShadow: `0 0 58px ${crystal.color}88` }} />
                <span style={{ position: 'absolute', bottom: '1rem', right: '1rem', color: 'var(--amber)', opacity: 0.35, fontSize: '0.58rem' }}>✧</span>
              </>
            )}
          </div>

          <button onClick={() => toggleFavorite(crystal.id)} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem',
            padding: '0.62rem', borderRadius: '0.875rem', cursor: 'pointer', transition: 'all 0.15s',
            background: fav ? 'rgba(160,50,30,0.07)' : 'rgba(230,210,190,0.2)',
            color: fav ? '#A03020' : 'var(--text-sec)',
            border: fav ? '1px solid rgba(160,50,30,0.22)' : '1px solid var(--border)',
            fontFamily: "'Inter', sans-serif", fontSize: '0.82rem',
          }}>
            {fav ? '♥ Dans vos favoris' : '♡ Ajouter aux favoris'}
          </button>

          <div className="info-card">
            {crystal.origin && (
              <div className="info-row">
                <span style={{ color: 'var(--text-dim)' }}>⊹ Origine</span>
                <span style={{ color: 'var(--text)', fontWeight: 500 }}>{crystal.origin}</span>
              </div>
            )}
            {crystal.color && (
              <div className="info-row">
                <span style={{ color: 'var(--text-dim)' }}>● Couleur</span>
                <div style={{ width: '13px', height: '13px', borderRadius: '50%', backgroundColor: crystal.color }} />
              </div>
            )}
          </div>

          {crystal.stock && (
            <div className="info-card">
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-sec)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--amber)' }}>◇</span> Stock
              </div>
              {STOCK_CATEGORIES.map(({ key, label }) => {
                const val = crystal.stock[key] || 0;
                return (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.32rem 0', borderBottom: '1px solid rgba(221,208,188,0.35)', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>{label}</span>
                    <span style={{ fontWeight: 500, color: val === 0 ? '#A03020' : val < 5 ? '#8B6914' : 'var(--copper)' }}>{val}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Droite */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.1rem', color: 'var(--text)' }}>{crystal.name}</h1>
            {crystal.description && <p style={{ color: 'var(--text-sec)', lineHeight: 1.72, fontSize: '0.875rem', marginTop: '0.5rem' }}>{crystal.description}</p>}
          </div>

          <div className="divider-cel" style={{ margin: 0 }}>✦ · · ✦</div>

          {crystal.virtues?.length > 0 && (
            <div>
              <div className="dsec-title"><span>∗</span> Vertus</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {crystal.virtues.map(v => <span key={v} className="vbadge">{v}</span>)}
              </div>
            </div>
          )}

          {crystal.chakras?.length > 0 && (
            <div>
              <div className="dsec-title"><span>◯</span> Chakras associés</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {crystal.chakras.map(ch => (
                  <span key={ch.id} style={{ fontSize: '0.73rem', padding: '0.26rem 0.72rem', borderRadius: '999px', backgroundColor: ch.color + '14', color: ch.color, border: `1px solid ${ch.color}2E` }}>
                    ◯ {ch.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {crystal.zodiacSigns?.length > 0 && (
            <div>
              <div className="dsec-title"><span>☽</span> Signes associés</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {crystal.zodiacSigns.map(z => (
                  <span key={z.id} style={{ fontSize: '0.73rem', padding: '0.26rem 0.72rem', borderRadius: '999px', border: '1px solid var(--border)', color: 'var(--text-sec)', background: 'var(--bg)' }}>
                    {z.symbol} {z.name}{z.element && <span style={{ color: 'var(--text-dim)' }}> · {z.element}</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {crystal.compatibleWith?.length > 0 && (
            <div>
              <div className="dsec-title"><span>◌</span> Compatible avec</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {crystal.compatibleWith.map(c => (
                  <Link key={c.id} to={`/crystals/${c.id}`} style={{ fontSize: '0.73rem', padding: '0.26rem 0.72rem', borderRadius: '999px', border: '1px solid rgba(192,120,64,0.32)', color: 'var(--copper)', background: 'var(--bg)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c.color, display: 'inline-block' }} />
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {crystal.precautions?.length > 0 && (
            <div style={{ background: 'rgba(180,130,20,0.06)', border: '1px solid rgba(180,130,20,0.2)', borderRadius: '1rem', padding: '0.9rem 1.1rem' }}>
              <div className="dsec-title"><span>△</span> Précautions</div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {crystal.precautions.map(p => (
                  <li key={p.id} style={{ fontSize: '0.82rem', color: '#8B6914' }}>· {p.description}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
