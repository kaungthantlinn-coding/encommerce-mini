import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product.types';

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  isCheckingOut: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  startCheckout: () => void;
  completeCheckout: () => void;
  cancelCheckout: () => void;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isCheckingOut: false,

      addToCart: (product) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              ...state,
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
              isOpen: true,
            };
          }
          return { 
            ...state,
            items: [...state.items, { ...product, quantity: 1 }],
            isOpen: true,
          };
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          ...state,
          items: state.items.filter((item) => item.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          ...state,
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set((state) => ({ ...state, items: [] })),
      
      toggleCart: () => set((state) => ({ ...state, isOpen: !state.isOpen })),
      
      startCheckout: () => set((state) => ({ 
        ...state, 
        isCheckingOut: true,
        isOpen: false 
      })),
      
      completeCheckout: () => set((state) => ({ 
        ...state, 
        items: [],
        isCheckingOut: false 
      })),
      
      cancelCheckout: () => set((state) => ({ 
        ...state, 
        isCheckingOut: false 
      })),

      getSubtotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getTax: () => {
        const state = get();
        return state.getSubtotal() * 0.1; // 10% tax
      },

      getTotal: () => {
        const state = get();
        return state.getSubtotal() + state.getTax();
      },
    }),
    {
      name: 'cart-storage',
    }
  )
); 