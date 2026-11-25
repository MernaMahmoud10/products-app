'use client'

import ReactPaginate from 'react-paginate'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { productsHref, type ProductQuery } from '../_lib/query'

type Props = {
  query: ProductQuery
  page: number
  totalPages: number
}

const itemLink =
  'flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-300 px-3 text-sm font-medium transition-colors hover:bg-gray-100'

export default function Pagination({ query, page, totalPages }: Props) {
  const router = useRouter()
  if (totalPages <= 1) return null

  // react-paginate counts pages from 0, our URL counts from 1.
  const hrefFor = (pageNumber: number) => productsHref(query, { page: pageNumber })

  return (
    <ReactPaginate
      pageCount={totalPages}
      forcePage={page - 1}
      onPageChange={({ selected }) => router.push(hrefFor(selected + 1))}
      hrefBuilder={(pageNumber) => hrefFor(pageNumber)}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      previousLabel={
        <>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </>
      }
      nextLabel={
        <>
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </>
      }
      breakLabel="…"
      containerClassName="mt-8 flex flex-wrap items-center justify-center gap-2"
      pageLinkClassName={itemLink}
      previousLinkClassName={`${itemLink} gap-1`}
      nextLinkClassName={`${itemLink} gap-1`}
      breakLinkClassName="flex h-10 min-w-10 cursor-pointer items-center justify-center text-gray-600"
      activeLinkClassName="border-blue-600! bg-blue-600! text-white! hover:bg-blue-700!"
      disabledLinkClassName="cursor-not-allowed! border-gray-200! text-gray-400! hover:bg-transparent!"
    />
  )
}
