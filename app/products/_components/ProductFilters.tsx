import Form from 'next/form'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { SORT_OPTIONS, type ProductQuery } from '../_lib/query'

type Props = {
  query: ProductQuery
  categories: string[]
}

const controlClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 transition-colors hover:border-gray-400'

// A GET form: submitting it puts the values in the URL (?q=…&category=…&sort=…).
export default function ProductFilters({ query, categories }: Props) {
  const hasFilters = Boolean(query.q || query.category || query.sort)

  return (
    <Form
      action="/products"
      // Reset the inputs when the URL changes (e.g. after "Clear").
      key={`${query.q}|${query.category}|${query.sort}`}
      role="search"
      className="mb-6 grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto]"
    >
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Search by title</span>
        <span className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
            aria-hidden="true"
          />
          <input
            type="search"
            name="q"
            defaultValue={query.q}
            placeholder="e.g. lipstick"
            className={`${controlClass} pl-9`}
          />
        </span>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Category</span>
        <select name="category" defaultValue={query.category} className={`${controlClass} capitalize`}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c.replace(/-/g, ' ')}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Sort by</span>
        <select name="sort" defaultValue={query.sort} className={controlClass}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 lg:flex-none"
        >
          Apply
        </button>
        {hasFilters && (
          <Link
            href="/products"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-center font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            Clear
          </Link>
        )}
      </div>
    </Form>
  )
}
