import Skeleton from 'react-loading-skeleton'

export function ProductGridSkeleton() {
  return (
    <div aria-busy="true">
      <span className="sr-only" role="status">
        Loading products…
      </span>
      {/* Filters bar */}
      <Skeleton className="mb-6 h-36 sm:h-24 lg:h-20" borderRadius="0.75rem" />
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <li key={i} className="rounded-xl border border-gray-200 p-4">
            <Skeleton height={160} className="mb-4" />
            <Skeleton width="75%" />
            <Skeleton width="35%" className="mb-3" />
            <div className="flex justify-between">
              <Skeleton width={60} />
              <Skeleton width={40} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6" aria-busy="true">
      <span className="sr-only" role="status">
        Loading product…
      </span>
      <Skeleton width={160} height={24} />
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <Skeleton height={320} borderRadius="0.5rem" />
        <div>
          <Skeleton width={100} />
          <Skeleton width="75%" height={32} className="mb-3" />
          <Skeleton width={120} height={24} className="mb-4" />
          <Skeleton count={4} />
        </div>
      </div>
    </main>
  )
}
