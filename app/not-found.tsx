import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Page not found' }

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col items-center gap-3 px-4 py-16 text-center">
      <p className="text-5xl font-bold text-blue-600">404</p>
      <h1 className="text-xl font-bold">Page not found</h1>
      <p className="text-gray-600">The page you’re looking for doesn’t exist.</p>
      <Link
        href="/products"
        className="mt-2 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition-colors hover:bg-blue-700"
      >
        Go to products
      </Link>
    </main>
  )
}
