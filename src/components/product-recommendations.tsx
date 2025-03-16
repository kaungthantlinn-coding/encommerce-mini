import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Product } from '@/types/product.types'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { useNavigate } from 'react-router-dom'

interface ProductRecommendationsProps {
  currentProduct: Product
  allProducts: Product[]
}

export function ProductRecommendations({
  currentProduct,
  allProducts,
}: ProductRecommendationsProps) {
  const navigate = useNavigate()
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const cartItems = useCartStore((state) => state.items)
  const wishlistItems = useWishlistStore((state) => state.items)

  useEffect(() => {
    // Simple collaborative filtering based on category and user behavior
    const getRecommendations = () => {
      // Filter products in the same category
      const categoryMatches = allProducts.filter(
        (product) =>
          product.category === currentProduct.category &&
          product.id !== currentProduct.id
      )

      // Filter products with similar price range (±30%)
      const priceRange = currentProduct.price * 0.3
      const priceMatches = allProducts.filter(
        (product) =>
          Math.abs(product.price - currentProduct.price) <= priceRange &&
          product.id !== currentProduct.id
      )

      // Combine and deduplicate recommendations
      const combined = [...categoryMatches, ...priceMatches]
      const unique = Array.from(new Set(combined))

      // Sort by relevance (products in both category and price range first)
      const sorted = unique.sort((a, b) => {
        const aScore =
          (categoryMatches.includes(a) ? 2 : 0) +
          (priceMatches.includes(a) ? 1 : 0)
        const bScore =
          (categoryMatches.includes(b) ? 2 : 0) +
          (priceMatches.includes(b) ? 1 : 0)
        return bScore - aScore
      })

      return sorted.slice(0, 4) // Return top 4 recommendations
    }

    setRecommendations(getRecommendations())
  }, [currentProduct, allProducts, cartItems, wishlistItems])

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">You Might Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-contain mb-4"
            />
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              ${product.price.toFixed(2)}
            </p>
            <button
              onClick={() => navigate(`/products/${product.id}/${product.slug || ''}`)}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md"
            >
              View Details
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 