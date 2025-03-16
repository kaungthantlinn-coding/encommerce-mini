import { create } from 'zustand';
import { FilterState, FilterAction, PriceRange, SortOption } from '@/types/filter.types';

const initialState: FilterState = {
  search: '',
  categories: [],
  priceRange: { min: 0, max: 1000 },
  sortBy: 'newest',
  inStock: false,
  page: 1,
  perPage: 12,
};

interface FilterStore extends FilterState {
  dispatch: (action: FilterAction) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,
  dispatch: (action) => {
    switch (action.type) {
      case 'SET_SEARCH':
        set({ search: action.payload, page: 1 });
        break;
      case 'SET_CATEGORIES':
        set({ categories: action.payload, page: 1 });
        break;
      case 'SET_PRICE_RANGE':
        set({ priceRange: action.payload as PriceRange, page: 1 });
        break;
      case 'SET_SORT':
        set({ sortBy: action.payload as SortOption['value'] });
        break;
      case 'TOGGLE_IN_STOCK':
        set((state) => ({ inStock: !state.inStock, page: 1 }));
        break;
      case 'SET_PAGE':
        set({ page: action.payload });
        break;
      case 'RESET_FILTERS':
        set(initialState);
        break;
      default:
        break;
    }
  },
})); 