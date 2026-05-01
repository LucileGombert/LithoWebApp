import { Link } from 'react-router-dom';
import useFavoritesStore from '../store/useFavoritesStore';

export default function CrystalCard({ crystal }) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const fav = isFavorite(crystal.id);

  const totalStock = crystal.stock
    ? Object.entries(crystal.stock)
        .filter(([k]) => !['id', 'crystalId', 'updatedAt'].includes(k))
        .reduce((sum, [, v]) => sum + (v || 0), 0)
    : null;

  const stockBadge = totalStock === null ? null
    : totalStock === 0 ? { label: 'Rupture', s: { background: 'rgba(160,50,30,0.09)', color: '#A03020', border: '1px solid rgba(160,50,30,0.22)' } }
    : totalStock < 10  ? { label: `${totalStock} en stock`, s: { background: 'rgba(180,130,20,0.12)', color: '#8B6914', border: '1px solid rgba(180,130,20,0.28)' } }
    : { label: `${totalStock} en stock`, s: { background: 'rgba(192,120,64,0.13)', color: 'var(--copper)', border: '1px solid rgba(192,120,64,0.28)' } };

  return (
    <div className="crystal-card group relative">
      <Link to={`/crystals/${crystal.id}`}>
        <div style={{
          height: '138px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', background: `radial-gradient(circle, ${crystal.color}33, ${crystal.color}11)`,
        }}>
          {crystal.imageUrl ? (
            <img src={crystal.imageUrl} alt={crystal.name}
              style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '58px', height: '58px', borderRadius: '50%',
              backgroundColor: crystal.color, boxShadow: `0 0 26px ${crystal.color}66`,
            }} />
          )}
          {stockBadge && (
            <span style={{
              position: 'absolute', top: '0.5rem', right: '0.5rem',
              fontSize: '0.63rem', padding: '0.14rem 0.48rem',
              borderRadius: '999px', fontWeight: 500, ...stockBadge.s,
            }}>
              {stockBadge.label}
            </span>
          )}
        </div>
      </Link>

      <div style={{ padding: '0.8rem 0.9rem 0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <Link to={`/crystals/${crystal.id}`} style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.93rem', color: 'var(--text)' }}>
              {crystal.name}
            </div>
          </Link>
          <button
            onClick={() => toggleFavorite(crystal.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: fav ? '#A03020' : 'var(--text-dim)',
              fontSize: '0.85rem', flexShrink: 0, transition: 'all 0.15s',
            }}
            title={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            {fav ? '♥' : '♡'}
          </button>
        </div>

        {crystal.virtues?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.28rem', marginTop: '0.35rem' }}>
            {crystal.virtues.slice(0, 3).map(v => (
              <span key={v} style={{
                fontSize: '0.63rem', padding: '0.18rem 0.5rem', borderRadius: '999px',
                border: '1px solid var(--border)', color: 'var(--text-sec)', background: 'var(--bg)',
              }}>{v}</span>
            ))}
            {crystal.virtues.length > 3 && (
              <span style={{
                fontSize: '0.63rem', padding: '0.18rem 0.5rem', borderRadius: '999px',
                border: '1px solid var(--border)', color: 'var(--text-dim)', background: 'var(--bg)',
              }}>+{crystal.virtues.length - 3}</span>
            )}
          </div>
        )}

        {crystal.chakras?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.28rem', marginTop: '0.32rem' }}>
            {crystal.chakras.slice(0, 2).map(ch => (
              <span key={ch.id} style={{
                fontSize: '0.63rem', padding: '0.18rem 0.5rem', borderRadius: '999px', fontWeight: 500,
                backgroundColor: ch.color + '18', color: ch.color, border: `1px solid ${ch.color}30`,
              }}>
                ◯ {ch.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
