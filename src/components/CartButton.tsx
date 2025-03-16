import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cart.store';

interface Props {
  className?: string;
}

export function CartButton({ className = '' }: Props) {
  const { items, toggleCart } = useCartStore();

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleCart}
      className={`relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none ${className}`}
      aria-label="Open cart"
    >
      <ShoppingBagIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          >
            {itemCount}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}