import { cacheLife } from 'next/cache'

export const API_URL = 'https://dummyjson.com/products'

export type Review = {
  rating: number
  comment: string
  date: string
  reviewerName: string
}

export type Product = {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand?: string
  sku: string
  weight: number
  dimensions: { width: number; height: number; depth: number }
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  returnPolicy: string
  minimumOrderQuantity: number
  reviews: Review[]
  images: string[]
  thumbnail: string
}

export async function getProducts(): Promise<Product[]> {
  'use cache'
  cacheLife('hours')

  // limit=0 asks DummyJSON for all products (the default is only 30).
  const res = await fetch(`${API_URL}?limit=0`)
  if (!res.ok) throw new Error('Failed to fetch products')
  const data: { products: Product[] } = await res.json()
  return data.products
}

export async function getProduct(id: string): Promise<Product | null> {
  'use cache'
  cacheLife('hours')

  if (!/^\d+$/.test(id)) return null // e.g. /products/abc

  const res = await fetch(`${API_URL}/${id}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch product')
  return res.json()
}

export async function getCategories(): Promise<string[]> {
  'use cache'
  cacheLife('days')

  const res = await fetch(`${API_URL}/category-list`)
  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json()
}

// Ids of the products on the first list page, prerendered at build time.
// Other ids are rendered on first visit and then cached.
export async function getProductIdParams() {
  const products = await getProducts()
  return products.slice(0, 12).map((p) => ({ id: String(p.id) }))
}
