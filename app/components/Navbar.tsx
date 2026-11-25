'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Plus } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const isAdd = pathname === '/products/new'
  const isProducts = pathname.startsWith('/products') && !isAdd

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6"
      >
        <Link href="/products" className="flex items-center gap-2 rounded-lg">
          <ShoppingBag className="h-6 w-6 text-blue-600" aria-hidden="true" />
          <span className="text-lg font-bold text-gray-900 sm:text-xl">ProductHub</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/products"
            aria-current={isProducts ? 'page' : undefined}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isProducts
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
            }`}
          >
            Products
          </Link>

          <Link
            href="/products/new"
            aria-current={isAdd ? 'page' : undefined}
            className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors ${
              isAdd ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add<span className="hidden sm:inline">&nbsp;product</span>
          </Link>
        </div>
      </nav>
    </header>
  )
}
