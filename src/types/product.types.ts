export interface Product {
  id: number;
  name: string;  // This will be mapped from title in the API response
  title?: string; // Optional since we'll map it to name
  slug?: string; // URL-friendly version of the name
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
} 