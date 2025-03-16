import { z } from 'zod'

export const checkoutFormSchema = z.object({
  // Contact Information
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),

  // Shipping Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),

  // Shipping Method
  shippingMethod: z.enum(['standard', 'express', 'overnight']),

  // Payment Information
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Invalid expiry date (MM/YY)'),
  cardCvc: z.string().regex(/^\d{3,4}$/, 'CVC must be 3 or 4 digits'),
  cardName: z.string().min(2, 'Name on card must be at least 2 characters'),

  // Additional Options
  saveInformation: z.boolean().default(false),
  signUpNewsletter: z.boolean().default(false),
})

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>

export const shippingMethods = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Delivery in 3-5 business days',
    price: 4.99,
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: 'Delivery in 2-3 business days',
    price: 9.99,
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'Next day delivery',
    price: 19.99,
  },
] 