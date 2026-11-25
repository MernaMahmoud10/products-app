import Link from 'next/link'
import { PackageX } from 'lucide-react'

export default function ProductNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col items-center gap-3 px-4 py-16 text-center">
      <PackageX className="h-10 w-10 text-gray-400" aria-hidden="true" />
      <h1 className="text-xl font-bold">Product not found</h1>
      <p className="text-gray-600">
        This product doesn’t exist or may have been removed.
      </p>
      <Link
        href="/products"
        className="mt-2 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition-colors hover:bg-blue-700"
      >
        Back to products
      </Link>
    </main>
  )
}
