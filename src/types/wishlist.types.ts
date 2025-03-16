export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

export interface WishlistState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

export type WishlistAction =
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'SET_WISHLIST'; payload: Product[] }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }; 