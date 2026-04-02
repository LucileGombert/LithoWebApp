import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store des favoris — persisté dans localStorage
const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [], // liste d'IDs

      addFavorite: (crystalId) => {
        const { favorites } = get();
        if (!favorites.includes(crystalId)) {
          set({ favorites: [...favorites, crystalId] });
        }
      },

      removeFavorite: (crystalId) => {
        set({ favorites: get().favorites.filter(id => id !== crystalId) });
      },

      toggleFavorite: (crystalId) => {
        const { favorites } = get();
        if (favorites.includes(crystalId)) {
          set({ favorites: favorites.filter(id => id !== crystalId) });
        } else {
          set({ favorites: [...favorites, crystalId] });
        }
      },

      isFavorite: (crystalId) => get().favorites.includes(crystalId),

      clearFavorites: () => set({ favorites: [] })
    }),
    {
      name: 'litho-favorites', // clé localStorage
    }
  )
);

export default useFavoritesStore;
