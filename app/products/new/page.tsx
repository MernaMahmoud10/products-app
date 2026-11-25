import type { Metadata } from 'next'
import ProductForm from '../_components/ProductForm'
import { getCategories } from '../_lib/api'

export const metadata: Metadata = { title: 'Add product' }

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold mb-6">Add product</h1>
      <ProductForm categories={categories} />
    </main>
  )
}
