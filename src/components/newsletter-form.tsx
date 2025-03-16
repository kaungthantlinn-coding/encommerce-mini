import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
  preferences: z.array(z.string()).optional(),
})

type NewsletterFormValues = z.infer<typeof newsletterSchema>

const PREFERENCES = [
  { id: 'new-arrivals', label: 'New Arrivals' },
  { id: 'promotions', label: 'Promotions & Discounts' },
  { id: 'exclusive', label: 'Exclusive Offers' },
  { id: 'product-updates', label: 'Product Updates' },
]

export function NewsletterForm() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      preferences: ['new-arrivals', 'promotions'],
    },
  })

  const onSubmit = async (data: NewsletterFormValues) => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // In a real app, you would send this data to your API
    console.log('Newsletter subscription data:', data)
    
    setIsLoading(false)
    setIsSubmitted(true)
    reset()
    
    toast.success('Thank you for subscribing to our newsletter!')
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-8 md:px-10 md:py-12">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <CheckCircleIcon className="h-16 w-16 text-white mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Thank You for Subscribing!</h2>
              <p className="text-blue-100 mb-6">
                You've been added to our newsletter list. Get ready for exclusive offers and updates!
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Subscribe Another Email
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-center mb-2">
                <EnvelopeIcon className="h-8 w-8 text-white mr-2" />
                <h2 className="text-2xl font-bold text-white">Stay Updated</h2>
              </div>
              <p className="text-blue-100 text-center mb-6">
                Subscribe to our newsletter for exclusive offers, new arrivals, and more!
              </p>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <input
                        type="email"
                        placeholder="Your email address"
                        className={`w-full px-4 py-3 rounded-md border-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.email 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                            : 'border-transparent'
                        }`}
                        onFocus={() => !isExpanded && setIsExpanded(true)}
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-100">{errors.email.message}</p>
                      )}
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-white text-blue-700 font-medium rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Subscribing...
                        </div>
                      ) : (
                        'Subscribe'
                      )}
                    </button>
                  </div>
                </div>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-white mb-1">
                            First Name
                          </label>
                          <input
                            id="firstName"
                            type="text"
                            className={`w-full px-4 py-2 rounded-md border-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.firstName 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                                : 'border-transparent'
                            }`}
                            {...register('firstName')}
                          />
                          {errors.firstName && (
                            <p className="mt-1 text-sm text-red-100">{errors.firstName.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-white mb-1">
                            Last Name
                          </label>
                          <input
                            id="lastName"
                            type="text"
                            className={`w-full px-4 py-2 rounded-md border-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.lastName 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                                : 'border-transparent'
                            }`}
                            {...register('lastName')}
                          />
                          {errors.lastName && (
                            <p className="mt-1 text-sm text-red-100">{errors.lastName.message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          I'm interested in (optional)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {PREFERENCES.map((preference) => (
                            <div key={preference.id} className="flex items-center">
                              <input
                                id={preference.id}
                                type="checkbox"
                                value={preference.id}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                {...register('preferences')}
                              />
                              <label htmlFor={preference.id} className="ml-2 block text-sm text-white">
                                {preference.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-xs text-blue-100">
                        By subscribing, you agree to our <a href="/privacy-policy" className="underline hover:text-white">Privacy Policy</a> and consent to receive marketing emails. You can unsubscribe at any time.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 