export interface PriceRange {
  min: number;
  max: number;
}

export interface SortOption {
  label: string;
  value: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest' | 'popular';
}

export interface FilterState {
  search: string;
  categories: string[];
  priceRange: PriceRange;
  sortBy: SortOption['value'];
  inStock: boolean;
  page: number;
  perPage: number;
}

export interface FilterAction {
  type: 
    | 'SET_SEARCH'
    | 'SET_CATEGORIES'
    | 'SET_PRICE_RANGE'
    | 'SET_SORT'
    | 'TOGGLE_IN_STOCK'
    | 'SET_PAGE'
    | 'RESET_FILTERS';
  payload?: any;
} 