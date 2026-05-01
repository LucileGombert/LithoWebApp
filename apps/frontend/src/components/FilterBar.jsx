import useCrystalStore from '../store/useCrystalStore';

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
  { label: 'Gris',   value: 'gris',   hex: '#708090' },
  { label: 'Marron', value: 'marron', hex: '#C8860A' },
];

const chipBase = {
  fontSize: '0.73rem', padding: '0.32rem 0.85rem', borderRadius: '999px',
  cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.15s',
  border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-sec)',
};
const chipOn = {
  ...chipBase,
  border: '1px solid var(--copper)', color: 'var(--copper)', background: 'rgba(192,120,64,0.08)',
};

export default function FilterBar() {
  const { filters, setFilter, resetFilters, chakras, zodiacs } = useCrystalStore();
  const hasActiveFilters = filters.color || filters.chakra || filters.zodiac;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center' }}>
      {/* Pastilles couleur */}
      {COLORS.map(c => (
        <button
          key={c.value}
          onClick={() => setFilter('color', filters.color === c.value ? '' : c.value)}
          title={c.label}
          style={{
            width: '22px', height: '22px', borderRadius: '50%',
            border: filters.color === c.value ? '2.5px solid var(--copper)' : '2px solid transparent',
            backgroundColor: c.hex, cursor: 'pointer', transition: 'all 0.15s', outline: 'none',
            transform: filters.color === c.value ? 'scale(1.2)' : 'scale(1)',
          }}
        />
      ))}

      {/* Chakra chips */}
      {chakras.map(ch => (
        <button
          key={ch.id}
          onClick={() => setFilter('chakra', filters.chakra === ch.name ? '' : ch.name)}
          style={filters.chakra === ch.name ? {
            ...chipBase,
            border: `1px solid ${ch.color}88`,
            color: ch.color,
            background: ch.color + '18',
          } : chipBase}
        >
          ◯ {ch.name}
        </button>
      ))}

      {/* Zodiaque */}
      {zodiacs.length > 0 && (
        <select
          value={filters.zodiac}
          onChange={e => setFilter('zodiac', e.target.value)}
          style={{
            ...chipBase,
            appearance: 'none',
            paddingRight: '1.2rem',
            background: filters.zodiac ? 'rgba(192,120,64,0.08)' : 'var(--bg-card)',
            color: filters.zodiac ? 'var(--copper)' : 'var(--text-sec)',
            border: filters.zodiac ? '1px solid var(--copper)' : '1px solid var(--border)',
            outline: 'none',
          }}
        >
          <option value="">☽ Tous les signes</option>
          {zodiacs.map(z => (
            <option key={z.id} value={z.name}>{z.symbol} {z.name}</option>
          ))}
        </select>
      )}

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          style={{
            fontSize: '0.7rem', color: 'var(--text-dim)', background: 'none', border: 'none',
            cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px',
            textDecorationColor: 'var(--border)', fontFamily: "'Inter', sans-serif",
          }}
        >
          Réinitialiser
        </button>
      )}
    </div>
  );
}
