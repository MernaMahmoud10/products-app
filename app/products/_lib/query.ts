import type { Product } from './api'

export const PAGE_SIZE = 12

export const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating-desc', label: 'Rating: high to low' },
  { value: 'rating-asc', label: 'Rating: low to high' },
]

export type ProductQuery = {
  q: string
  category: string
  sort: string
  page: number
}

// 1. Read the user's choices from the URL.
export function readQuery(searchParams: Record<string, string | string[] | undefined>) {
  const query: ProductQuery = {
    q: String(searchParams.q ?? ''),
    category: String(searchParams.category ?? ''),
    sort: String(searchParams.sort ?? ''),
    page: Math.max(1, parseInt(String(searchParams.page)) || 1),
  }
  return query
}

// 2. Search, filter, sort, and cut out one page.
export function queryProducts(products: Product[], query: ProductQuery) {
  let result = products

  // Search by title
  if (query.q) {
    result = result.filter((p) => p.title.toLowerCase().includes(query.q.toLowerCase()))
  }

  // Filter by category
  if (query.category) {
    result = result.filter((p) => p.category === query.category)
  }

  // Sort (copy first so the original list is not changed)
  result = [...result]
  if (query.sort === 'price-asc') result.sort((a, b) => a.price - b.price)
  if (query.sort === 'price-desc') result.sort((a, b) => b.price - a.price)
  if (query.sort === 'rating-asc') result.sort((a, b) => a.rating - b.rating)
  if (query.sort === 'rating-desc') result.sort((a, b) => b.rating - a.rating)

  // Pages
  const totalPages = Math.max(1, Math.ceil(result.length / PAGE_SIZE))
  const page = Math.min(query.page, totalPages)
  const start = (page - 1) * PAGE_SIZE

  return {
    items: result.slice(start, start + PAGE_SIZE),
    total: result.length,
    page,
    totalPages,
  }
}

// 3. Build a /products link that keeps the current choices.
export function productsHref(query: ProductQuery, changes: Partial<ProductQuery>) {
  const next = { ...query, ...changes }
  const params = new URLSearchParams()

  if (next.q) params.set('q', next.q)
  if (next.category) params.set('category', next.category)
  if (next.sort) params.set('sort', next.sort)
  if (next.page > 1) params.set('page', String(next.page))

  return params.size > 0 ? `/products?${params}` : '/products'
}
