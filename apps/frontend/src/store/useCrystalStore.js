import { create } from 'zustand';
import { crystalApi, chakraApi, zodiacApi, creationTypeApi } from '../services/api';

// Store principal des cristaux + filtres
const useCrystalStore = create((set, get) => ({
  // Données
  crystals: [],
  chakras: [],
  zodiacs: [],
  creationTypes: [],

  // État de chargement
  loading: false,
  error: null,

  // Filtres actifs
  filters: {
    search: '',
    color: '',
    chakra: '',
    zodiac: ''
  },

  // Cristal sélectionné (fiche détail)
  selectedCrystal: null,

  // === Actions ===

  fetchCrystals: async (params) => {
    set({ loading: true, error: null });
    try {
      const crystals = await crystalApi.getAll(params || get().filters);
      set({ crystals, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchCrystalById: async (id) => {
    set({ loading: true, error: null });
    try {
      const crystal = await crystalApi.getById(id);
      set({ selectedCrystal: crystal, loading: false });
      return crystal;
    } catch (err) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  fetchChakras: async () => {
    try {
      const chakras = await chakraApi.getAll();
      set({ chakras });
    } catch (err) {
      console.error('fetchChakras error:', err);
    }
  },

  fetchZodiacs: async () => {
    try {
      const zodiacs = await zodiacApi.getAll();
      set({ zodiacs });
    } catch (err) {
      console.error('fetchZodiacs error:', err);
    }
  },

  fetchCreationTypes: async () => {
    try {
      const creationTypes = await creationTypeApi.getAll();
      set({ creationTypes });
    } catch (err) {
      console.error('fetchCreationTypes error:', err);
    }
  },

  setFilter: (key, value) => {
    const filters = { ...get().filters, [key]: value };
    set({ filters });
    get().fetchCrystals(filters);
  },

  resetFilters: () => {
    const filters = { search: '', color: '', chakra: '', zodiac: '' };
    set({ filters });
    get().fetchCrystals(filters);
  },

  updateStockLocal: (crystalId, stockData) => {
    const crystals = get().crystals.map(c =>
      c.id === crystalId ? { ...c, stock: { ...c.stock, ...stockData } } : c
    );
    set({ crystals });
  }
}));

export default useCrystalStore;
