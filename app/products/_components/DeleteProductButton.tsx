'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteProduct, DeleteProductResult } from '../_lib/actions'

type Props = {
  productId: number
  productTitle: string
}

export default function DeleteProductButton({ productId, productTitle }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<DeleteProductResult | null>(null)

  function open() {
    setResult(null)
    dialogRef.current?.showModal()
  }

  function close() {
    if (pending) return
    dialogRef.current?.close()
  }

  function confirmDelete() {
    startTransition(async () => {
      const res = await deleteProduct(productId)
      setResult(res)
      if (res.status === 'success') {
        setTimeout(() => router.push('/products'), 1500)
      }
    })
  }

  const done = result?.status === 'success'

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="flex items-center gap-2 rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="delete-title"
        onCancel={(e) => pending && e.preventDefault()}
        // Close when clicking the backdrop (outside the panel).
        onClick={(e) => e.target === dialogRef.current && close()}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl p-0 shadow-xl backdrop:bg-black/50"
      >
        <div className="p-6">
          <h2 id="delete-title" className="text-lg font-bold">
            Delete product?
          </h2>
          <p className="mt-2 text-gray-600">
            Are you sure you want to delete <strong>{productTitle}</strong>? This
            can’t be undone.
          </p>

          {result && (
            <p
              role="status"
              className={`mt-4 rounded-lg p-3 text-sm ${
                done ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {result.message} {done && 'Redirecting…'}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={close}
              disabled={pending || done}
              autoFocus
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={pending || done}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {pending ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}
