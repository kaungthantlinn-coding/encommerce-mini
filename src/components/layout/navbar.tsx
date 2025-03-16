import { Link } from 'react-router-dom'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '@/store/cart'
import { motion } from 'framer-motion'

export function Navbar() {
  const cartCount = useCartStore((state) => state.items.length);

  return (
    <nav className="border-b bg-white dark:bg-gray-800 shadow-sm">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          EcomMini
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/products" className="hover:text-primary">
            Products
          </Link>
          
          <Link to="/cart" className="relative">
            <ShoppingBagIcon className="w-6 h-6" />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}