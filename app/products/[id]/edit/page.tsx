import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductForm from '../../_components/ProductForm'
import { getCategories, getProduct, getProductIdParams } from '../../_lib/api'

export const generateStaticParams = getProductIdParams

export async function generateMetadata({
  params,
}: PageProps<'/products/[id]/edit'>): Promise<Metadata> {
  const product = await getProduct((await params).id)
  return { title: product ? `Edit ${product.title}` : 'Product not found' }
}

export default async function EditProductPage({ params }: PageProps<'/products/[id]/edit'>) {
  const { id } = await params
  const [product, categories] = await Promise.all([getProduct(id), getCategories()])
  if (!product) notFound()

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold mb-6">Edit product</h1>
      <ProductForm categories={categories} product={product} />
    </main>
  )
}
