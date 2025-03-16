import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product.types';
import { useCartStore } from '@/store/cart.store';
import { formatCurrency } from '@/utils/format';
import { useWishlistStore } from '../stores/wishlistStore';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const { addToCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id.toString());

  const handleToggleWishlist = () => {
    console.log('Toggling wishlist for product:', product.id);
    toggleItem(product.id.toString());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      <Link to={`/products/${product.id}/${product.slug || ''}`} className="block">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain object-center p-4"
          />
        </div>
      </Link>

      <button
        onClick={handleToggleWishlist}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 transition-colors"
      >
        {isWishlisted ? (
          <HeartSolidIcon className="h-5 w-5 text-red-500" />
        ) : (
          <HeartIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-200" />
        )}
      </button>

      <div className="p-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          <Link to={`/products/${product.id}/${product.slug || ''}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{product.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {formatCurrency(product.price)}
          </p>
          <div className="flex items-center">
            <span className="text-sm text-yellow-400">★</span>
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
              {product.rating.rate} ({product.rating.count})
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          onClick={() => addToCart(product)}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
} 