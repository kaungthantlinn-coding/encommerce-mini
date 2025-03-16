import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WishlistState, Product } from '@/types/wishlist.types';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface WishlistStore extends WishlistState {
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  syncWishlist: () => Promise<void>;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addToWishlist: async (product) => {
        try {
          set({ loading: true, error: null });
          await axios.post(`${API_URL}/wishlist`, { productId: product.id });
          set((state) => ({
            items: [...state.items, product],
            loading: false,
          }));
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to add item to wishlist',
          });
        }
      },

      removeFromWishlist: async (productId) => {
        try {
          set({ loading: true, error: null });
          await axios.delete(`${API_URL}/wishlist/${productId}`);
          set((state) => ({
            items: state.items.filter((item) => item.id !== productId),
            loading: false,
          }));
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to remove item from wishlist',
          });
        }
      },

      clearWishlist: async () => {
        try {
          set({ loading: true, error: null });
          await axios.delete(`${API_URL}/wishlist`);
          set({ ...initialState });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to clear wishlist',
          });
        }
      },

      syncWishlist: async () => {
        try {
          set({ loading: true, error: null });
          const { data } = await axios.get(`${API_URL}/wishlist`);
          set({ items: data, loading: false });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to sync wishlist',
          });
        }
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
); 