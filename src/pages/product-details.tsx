import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useCartStore } from '@/store/cart.store'
import { useWishlistStore } from '@/stores/wishlistStore'
import { ProductRecommendations } from '@/components/product-recommendations'
import { NewsletterForm } from '@/components/newsletter-form'
import { formatCurrency, generateSlug } from '@/utils/format'
import {
  HeartIcon,
  ShoppingCartIcon,
  ShareIcon,
  StarIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  ArrowsPointingOutIcon,
  XMarkIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  ScaleIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

// Mock data for demo
const SIZES = ['XS', 'S', 'M', 'L', 'XL']
const COLORS = ['Red', 'Blue', 'Green', 'Black', 'White']
const STOCK_STATUS = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock'
}

// Size guide data
const SIZE_GUIDE = {
  XS: { chest: '32-34', waist: '26-28', hips: '34-36' },
  S: { chest: '34-36', waist: '28-30', hips: '36-38' },
  M: { chest: '36-38', waist: '30-32', hips: '38-40' },
  L: { chest: '38-40', waist: '32-34', hips: '40-42' },
  XL: { chest: '40-42', waist: '34-36', hips: '42-44' }
}

// Price adjustments for options
const PRICE_ADJUSTMENTS = {
  color: {
    Red: 5,
    Blue: 3,
    Green: 2,
    Black: 0,
    White: 0
  },
  size: {
    XS: -2,
    S: 0,
    M: 0,
    L: 2,
    XL: 4
  }
}

interface ProductReview {
  id: number
  user: string
  rating: number
  comment: string
  date: string
}

const MOCK_REVIEWS: ProductReview[] = [
  {
    id: 1,
    user: 'John Doe',
    rating: 5,
    comment: 'Great product! Exactly what I was looking for.',
    date: '2024-03-15'
  },
  {
    id: 2,
    user: 'Jane Smith',
    rating: 4,
    comment: 'Good quality but slightly expensive.',
    date: '2024-03-14'
  }
]

export function ProductDetails() {
  const { id, slug } = useParams()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [is360View, setIs360View] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [compareProducts, setCompareProducts] = useState<any[]>([])
  const imageRef = useRef<HTMLDivElement>(null)

  const { addToCart } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist, toggleItem } = useWishlistStore()

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`)
      if (!response.ok) throw new Error('Failed to fetch product')
      const data = await response.json()
      return {
        ...data,
        name: data.title,
        slug: generateSlug(data.title),
        stock: Math.floor(Math.random() * 50) // Mock stock data
      }
    },
  })

  const { data: allProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('https://fakestoreapi.com/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      return data.map((product: any) => ({
        ...product,
        name: product.title,
        slug: generateSlug(product.title)
      }))
    },
  })

  // Calculate adjusted price based on selected options
  const calculateAdjustedPrice = () => {
    if (!product) return 0
    let adjustedPrice = product.price
    if (selectedColor) {
      adjustedPrice += PRICE_ADJUSTMENTS.color[selectedColor]
    }
    if (selectedSize) {
      adjustedPrice += PRICE_ADJUSTMENTS.size[selectedSize]
    }
    return adjustedPrice
  }

  // Handle 360 view rotation
  const handle360MouseDown = (e: React.MouseEvent) => {
    if (!is360View) return
    setIsDragging(true)
    setStartX(e.clientX)
  }

  const handle360MouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !is360View) return
    const diff = e.clientX - startX
    setRotation(prev => (prev + diff) % 360)
    setStartX(e.clientX)
  }

  const handle360MouseUp = () => {
    setIsDragging(false)
  }

  // Handle product comparison
  const toggleCompare = (product: any) => {
    setCompareProducts(prev => {
      const isAlreadyComparing = prev.some(p => p.id === product.id)
      if (isAlreadyComparing) {
        return prev.filter(p => p.id !== product.id)
      }
      if (prev.length >= 3) {
        toast.error('Can only compare up to 3 products')
        return prev
      }
      return [...prev, product]
    })
  }

  // Store recently viewed products and update URL with slug
  useEffect(() => {
    if (!product) return

    // Update URL to include slug if it's not already there
    const { pathname } = window.location;
    if (pathname.split('/').length === 3 && product.slug) {
      navigate(`/products/${product.id}/${product.slug}`, { replace: true });
    }

    try {
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
      const updatedRecentlyViewed = [
        product,
        ...recentlyViewed.filter((p: any) => p.id !== product.id)
      ].slice(0, 4)
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed))
    } catch (error) {
      console.error('Error updating recently viewed products:', error)
    }
  }, [product, navigate])

  const getStockStatus = (stock: number) => {
    if (stock === 0) return STOCK_STATUS.OUT_OF_STOCK
    if (stock < 5) return STOCK_STATUS.LOW_STOCK
    return STOCK_STATUS.IN_STOCK
  }

  const handleShare = (platform: string) => {
    if (!product) return

    const url = window.location.href
    const text = `Check out this product: ${product.name}`
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`)
        break
    }
  }

  const handleImageZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
        <button
          onClick={() => navigate('/products')}
          className="text-primary hover:underline"
        >
          Back to Products
        </button>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('Product is out of stock')
      return
    }
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color')
      return
    }
    
    // Create a simplified product object that matches the expected structure
    const cartProduct = {
      ...product,
      quantity: quantity,
      // Only include properties that exist in the Product type
      id: product.id,
      name: product.name,
      price: calculateAdjustedPrice(),
      description: product.description,
      category: product.category,
      image: product.image,
      rating: product.rating
    }
    
    addToCart(cartProduct)
    toast.success('Added to cart')
  }

  const toggleWishlist = () => {
    toggleItem(product.id.toString())
    toast.success(isInWishlist(product.id.toString()) ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative bg-card rounded-lg p-8 overflow-hidden"
        >
          <div
            ref={imageRef}
            className="relative cursor-zoom-in"
            onMouseEnter={() => !is360View && setIsZoomed(true)}
            onMouseLeave={() => {
              setIsZoomed(false);
              setIsDragging(false);
            }}
            onMouseMove={(e) => {
              handleImageZoom(e);
              if (is360View) handle360MouseMove(e);
            }}
            onMouseDown={handle360MouseDown}
            onMouseUp={handle360MouseUp}
          >
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-[400px] object-contain transition-transform duration-200 ${
                isZoomed ? 'scale-150' : ''
              }`}
              style={{
                ...(isZoomed ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                } : {}),
                ...(is360View ? {
                  transform: `rotate(${rotation}deg)`
                } : {})
              }}
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setIs360View(!is360View)}
                className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                title={is360View ? 'Exit 360° view' : 'Enter 360° view'}
              >
                {is360View ? (
                  <XMarkIcon className="w-5 h-5" />
                ) : (
                  <ArrowPathIcon className="w-5 h-5" />
                )}
              </button>
              {!is360View && !isZoomed && (
                <div className="p-2 bg-black/50 text-white rounded-full">
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex gap-2">
              <button
                onClick={toggleWishlist}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {isInWishlist(product.id) ? (
                  <HeartSolidIcon className="w-6 h-6 text-red-500" />
                ) : (
                  <HeartIcon className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <ShareIcon className="w-6 h-6" />
              </button>
              <button
                onClick={() => toggleCompare(product)}
                className={`p-2 rounded-full transition-colors ${
                  compareProducts.some(p => p.id === product.id)
                    ? 'bg-primary text-white'
                    : 'hover:bg-muted'
                }`}
                title="Compare product"
              >
                <ScaleIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarSolidIcon
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(product.rating.rate)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.rating.count} reviews)
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <p className="text-2xl font-semibold">${calculateAdjustedPrice().toFixed(2)}</p>
            {(selectedSize || selectedColor) && product.price !== calculateAdjustedPrice() && (
              <p className="text-sm text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </p>
            )}
          </div>

          <p className="text-muted-foreground mb-6">{product.description}</p>

          <div className="space-y-4 mb-6">
            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Size</label>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <InformationCircleIcon className="w-4 h-4" />
                  Size Guide
                </button>
              </div>
              <div className="flex gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedColor === color
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'hover:border-primary'
                    }`}
                  >
                    {color}
                    {PRICE_ADJUSTMENTS.color[color] !== 0 && (
                      <span className="ml-1 text-xs">
                        {PRICE_ADJUSTMENTS.color[color] > 0 ? '+' : ''}
                        ${PRICE_ADJUSTMENTS.color[color]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-muted"
                disabled={product.stock === 0}
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-muted"
                disabled={product.stock === 0}
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-2 px-6 rounded-md flex items-center justify-center gap-2 transition-opacity ${
                product.stock === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:opacity-90'
              }`}
              disabled={product.stock === 0}
            >
              <ShoppingCartIcon className="w-5 h-5" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-2">Product Details</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Category: {product.category}</li>
              <li>Rating: {product.rating.rate} ({product.rating.count} reviews)</li>
              <li>SKU: {product.id}</li>
              <li className={`font-medium ${
                product.stock === 0
                  ? 'text-red-500'
                  : product.stock < 5
                  ? 'text-yellow-500'
                  : 'text-green-500'
              }`}>
                {getStockStatus(product.stock)}
                {product.stock > 0 && ` (${product.stock} units)`}
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowSizeGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-card p-6 rounded-lg max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Size Guide</h3>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="p-1 hover:bg-muted rounded-full"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Size</th>
                    <th className="py-2 text-left">Chest</th>
                    <th className="py-2 text-left">Waist</th>
                    <th className="py-2 text-left">Hips</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(SIZE_GUIDE).map(([size, measurements]) => (
                    <tr key={size} className="border-b last:border-0">
                      <td className="py-2">{size}</td>
                      <td className="py-2">{measurements.chest}"</td>
                      <td className="py-2">{measurements.waist}"</td>
                      <td className="py-2">{measurements.hips}"</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Comparison */}
      {compareProducts.length > 0 && (
        <div className="mt-12 bg-card rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Product Comparison</h2>
            <button
              onClick={() => setCompareProducts([])}
              className="text-sm text-primary hover:underline"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {compareProducts.map(product => (
              <div key={product.id} className="relative">
                <button
                  onClick={() => toggleCompare(product)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-contain mb-4"
                />
                <h3 className="font-medium mb-2">{product.name}</h3>
                <p className="text-lg font-semibold mb-2">${product.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center gap-1 mb-2">
                  <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">{product.rating.rate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
        <div className="space-y-6">
          {MOCK_REVIEWS.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarSolidIcon
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{review.user}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-muted-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Recommendations */}
      {allProducts && (
        <ProductRecommendations
          currentProduct={product}
          allProducts={allProducts}
        />
      )}

      {/* Newsletter Section */}
      <div className="mt-12">
        <NewsletterForm />
      </div>

      {/* Recently Viewed */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Recently Viewed</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
            .filter((p: any) => p.id !== product.id)
            .map((product: any) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-contain mb-4"
                />
                <h3 className="font-medium truncate">{product.name}</h3>
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
    </div>
  )
} 