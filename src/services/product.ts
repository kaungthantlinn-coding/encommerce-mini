import axios from 'axios'
import { z } from 'zod'

const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.string(),
  image: z.string(),
  rating: z.object({
    rate: z.number(),
    count: z.number(),
  }),
})

export type Product = z.infer<typeof productSchema>

const api = axios.create({
  baseURL: 'https://fakestoreapi.com',
})

export const productService = {
  async getProducts() {
    const { data } = await api.get('/products')
    return z.array(productSchema).parse(data)
  },

  async getProduct(id: number) {
    const { data } = await api.get(`/products/${id}`)
    return productSchema.parse(data)
  },

  async getCategories() {
    const { data } = await api.get('/products/categories')
    return z.array(z.string()).parse(data)
  },
} 