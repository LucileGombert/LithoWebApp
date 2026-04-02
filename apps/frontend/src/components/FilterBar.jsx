import useCrystalStore from '../store/useCrystalStore';

// Couleurs prédéfinies pour le filtre visuel
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
  { label: 'Gris', value: 'gris', hex: '#708090' },
  { label: 'Marron', value: 'marron', hex: '#C8860A' },
];

export default function FilterBar() {
  const { filters, setFilter, resetFilters, chakras, zodiacs } = useCrystalStore();
  const hasActiveFilters = filters.color || filters.chakra || filters.zodiac;

  return (
    <div className="space-y-4 bg-stone-900 border border-stone-800 rounded-2xl p-4">
      {/* Filtre couleur (visuel) */}
      <div>
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Couleur</p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(c => (
            <button
              key={c.value}
              onClick={() => setFilter('color', filters.color === c.value ? '' : c.value)}
              className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                filters.color === c.value ? 'border-white scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.label}
            />
          ))}
        </div>
        {filters.color && (
          <p className="text-xs text-stone-400 mt-1">
            Couleur : <span className="text-violet-300">{filters.color}</span>
          </p>
        )}
      </div>

      {/* Filtre chakra */}
      {chakras.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Chakra</p>
          <div className="flex flex-wrap gap-1.5">
            {chakras.map(ch => (
              <button
                key={ch.id}
                onClick={() => setFilter('chakra', filters.chakra === ch.name ? '' : ch.name)}
                className={`badge transition-all text-xs ${
                  filters.chakra === ch.name
                    ? 'bg-opacity-30 border scale-105'
                    : 'bg-stone-800 text-stone-400 border border-stone-700 hover:border-stone-500'
                }`}
                style={
                  filters.chakra === ch.name
                    ? { backgroundColor: ch.color + '33', borderColor: ch.color + '66', color: ch.color }
                    : {}
                }
              >
                {ch.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filtre signe astrologique */}
      {zodiacs.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Signe Astrologique</p>
          <select
            value={filters.zodiac}
            onChange={e => setFilter('zodiac', e.target.value)}
            className="input text-sm"
          >
            <option value="">Tous les signes</option>
            {zodiacs.map(z => (
              <option key={z.id} value={z.name}>
                {z.symbol} {z.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Reset */}
      {hasActiveFilters && (
        <button onClick={resetFilters} className="text-xs text-stone-400 hover:text-stone-200 underline transition-colors">
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}
