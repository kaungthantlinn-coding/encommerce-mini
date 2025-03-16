import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useWishlistStore } from '@/stores/wishlistStore';
import { motion } from 'framer-motion';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  showText?: boolean;
}

export function WishlistButton({ productId, className = '', showText = false }: WishlistButtonProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isActive = isInWishlist(productId);

  const handleToggleWishlist = () => {
    console.log('Toggling wishlist item:', productId);
    console.log('Current wishlist status:', isActive ? 'In wishlist' : 'Not in wishlist');
    toggleItem(productId);
  };

  return (
    <button
      onClick={handleToggleWishlist}
      className={`inline-flex items-center justify-center ${
        isActive 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
      } focus:outline-none transition-colors duration-200 ${className}`}
      aria-label={isActive ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <motion.span
        initial={{ scale: 1 }}
        animate={{ scale: isActive ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        {isActive ? (
          <HeartIconSolid className="w-6 h-6" />
        ) : (
          <HeartIcon className="w-6 h-6" />
        )}
      </motion.span>
      
      {showText && (
        <span className="ml-2 text-sm font-medium">
          {isActive ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
} 