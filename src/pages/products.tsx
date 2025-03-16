import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/store/cart.store';
import { ProductCard } from '@/components/product/product-card';
import { Product } from '@/types/product.types';
import { generateSlug } from '@/utils/format';

export function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { addToCart } = useCartStore();

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      // Transform the data to match our Product type
      return data.map((item: any) => ({
        ...item,
        name: item.title, // Map title to name for compatibility
        slug: generateSlug(item.title), // Generate slug from title
      }));
    },
  });

  const categories = ['all', ...new Set(products?.map(product => product.category) || [])];
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products?.filter(product => product.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading products</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Categories */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts?.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard
              product={product}
              onAddToCart={() => addToCart(product)}
            />
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {filteredProducts?.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">No products found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Try changing your category selection
          </p>
        </div>
      )}
    </div>
  );
}