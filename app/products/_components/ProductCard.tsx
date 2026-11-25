import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import type { Product } from '../_lib/api'

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product
  priority?: boolean
}) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
    >
      <div className="relative mb-4 h-40">
        <Image
          src={product.thumbnail}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h2 className="line-clamp-2 font-semibold group-hover:text-blue-700">{product.title}</h2>
      <p className="text-sm capitalize text-gray-600">{product.category.replace(/-/g, ' ')}</p>
      <div className="mt-auto flex items-center justify-between pt-3">
        <p className="font-bold">${product.price}</p>
        <p className="flex items-center gap-1 text-sm" aria-label={`Rating ${product.rating} out of 5`}>
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" aria-hidden="true" />
          {product.rating}
        </p>
      </div>
    </Link>
  )
}
