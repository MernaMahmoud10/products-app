import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { PackageSearch } from 'lucide-react'
import { getCategories, getProducts } from './_lib/api'
import { queryProducts, readQuery } from './_lib/query'
import ProductFilters from './_components/ProductFilters'
import ProductCard from './_components/ProductCard'
import Pagination from './_components/Pagination'
import { ProductGridSkeleton } from './_components/Skeletons'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse, search and filter all products.',
}

export default function ProductsPage({ searchParams }: PageProps<'/products'>) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">Products</h1>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductsView searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

async function ProductsView({
  searchParams,
}: {
  searchParams: PageProps<'/products'>['searchParams']
}) {
  const query = readQuery(await searchParams)
  const [products, categories] = await Promise.all([getProducts(), getCategories()])
  const { items, total, page, totalPages } = queryProducts(products, query)

  return (
    <>
      <ProductFilters query={query} categories={categories} />

      <p className="mb-4 text-sm text-gray-600" role="status">
        {total} {total === 1 ? 'product' : 'products'} found
      </p>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 px-4 py-16 text-center">
          <PackageSearch className="h-10 w-10 text-gray-400" aria-hidden="true" />
          <h2 className="text-lg font-semibold">No products found</h2>
          <p className="text-gray-600">Try a different search or category.</p>
          <Link href="/products" className="font-medium text-blue-700 hover:underline">
            Clear filters
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product, i) => (
            <li key={product.id}>
              <ProductCard product={product} priority={i < 4} />
            </li>
          ))}
        </ul>
      )}

      <Pagination query={query} page={page} totalPages={totalPages} />
    </>
  )
}
