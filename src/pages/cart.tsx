import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/cart'

export function Cart() {
  const navigate = useNavigate()
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()

  const total = items.reduce((acc, item) => {
    if (!item?.price || !item?.quantity) return acc
    return acc + item.price * item.quantity
  }, 0)

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(id)
      toast.success('Item removed from cart')
      return
    }
    updateQuantity(id, quantity)
  }

  if (!items?.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-4">Add some items to your cart to see them here.</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-md"
        >
          Browse Products
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Shopping Cart</h2>
        <button
          onClick={() => {
            clearCart()
            toast.success('Cart cleared')
          }}
          className="text-sm text-destructive hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          item && (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-4 bg-card p-4 rounded-lg"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-contain rounded"
              />
              
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  ${item.price?.toFixed(2) ?? '0.00'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateQuantity(item.id, (item.quantity ?? 0) - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-md border"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity ?? 0}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.id, (item.quantity ?? 0) + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-md border"
                >
                  +
                </button>
              </div>

              <div className="text-right min-w-[100px]">
                <div className="font-medium">
                  ${((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}
                </div>
                <button
                  onClick={() => {
                    removeItem(item.id)
                    toast.success('Item removed from cart')
                  }}
                  className="text-sm text-destructive hover:underline"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          )
        ))}
      </div>

      <div className="mt-8 p-4 bg-card rounded-lg">
        <div className="flex justify-between items-center text-lg font-medium mb-4">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <motion.button
          onClick={() => navigate('/checkout')}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium"
        >
          Proceed to Checkout
        </motion.button>
      </div>
    </div>
  )
} 