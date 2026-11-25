'use client'

import { useEffect } from 'react'
import { TriangleAlert } from 'lucide-react'

export default function ProductsError({
  error,
  retry,
}: {
  error: unknown
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col items-center gap-3 px-4 py-16 text-center">
      <TriangleAlert className="h-10 w-10 text-red-600" aria-hidden="true" />
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <p className="text-gray-600">
        We couldn’t load the products. Check your connection and try again.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-2 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition-colors hover:bg-blue-700"
      >
        Try again
      </button>
    </main>
  )
}
