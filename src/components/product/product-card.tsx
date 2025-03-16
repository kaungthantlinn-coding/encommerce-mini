import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useCartStore } from '@/store/cart.store'
import type { Product } from '@/types/product.types'

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart();
    } else {
      addToCart(product);
    }
    toast.success('Added to cart');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col shadow-sm hover:shadow-md transition-shadow"
    >
      <Link to={`/products/${product.id}`} className="aspect-square overflow-hidden rounded-md">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </Link>

      <div className="flex-1 py-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium line-clamp-2 text-gray-900 dark:text-white">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {product.category}
        </p>
        <div className="flex items-center mt-1">
          <span className="text-yellow-400">★</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
            {product.rating.rate} ({product.rating.count})
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-900 dark:text-white">
          ${product.price.toFixed(2)}
        </span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors"
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  )
} 