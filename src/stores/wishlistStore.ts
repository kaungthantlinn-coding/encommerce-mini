import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

interface WishlistState {
  items: string[];
  addItem: (item: string) => void;
  removeItem: (item: string) => void;
  toggleItem: (item: string) => void;
  isInWishlist: (item: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const { items } = get();
        if (!items.includes(item)) {
          set({ items: [...items, item] });
          toast.success('Added to wishlist');
        }
      },
      
      removeItem: (item) => {
        const { items } = get();
        set({ items: items.filter((i) => i !== item) });
        toast.success('Removed from wishlist');
      },
      
      toggleItem: (item) => {
        const { items, addItem, removeItem } = get();
        if (items.includes(item)) {
          removeItem(item);
        } else {
          addItem(item);
        }
      },
      
      isInWishlist: (item) => {
        const { items } = get();
        return items.includes(item);
      },
      
      clearWishlist: () => {
        set({ items: [] });
        toast.success('Wishlist cleared');
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
