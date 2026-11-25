'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { saveProduct, type SaveProductState } from '../_lib/actions'
import type { Product } from '../_lib/api'
import { parseProduct, type ProductErrors } from '../_lib/validation'

type Props = {
  categories: string[]
  product?: Product // in case editing only
}

export default function ProductForm({ categories, product }: Props) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(saveProduct, {
    status: 'idle',
  } as SaveProductState)
  // Errors found in the browser before sending (same Zod rules as the server).
  const [clientErrors, setClientErrors] = useState<ProductErrors | null>(null)

  useEffect(() => {
    if (state.status !== 'success' || !state.redirectTo) return
    const timer = setTimeout(() => router.push(state.redirectTo!), 1500)
    return () => clearTimeout(timer)
  }, [state, router])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const form = event.currentTarget
    const { errors } = parseProduct(new FormData(form))

    if (errors) {
      event.preventDefault() // block the invalid submit
      setClientErrors(errors)
      const firstInvalid = Array.from(form.elements).find(
        (el) => (el as HTMLInputElement).name in errors,
      )
      ;(firstInvalid as HTMLElement | undefined)?.focus()
    } else {
      setClientErrors(null)
    }
  }

  const errors = clientErrors ?? state.errors
  const error = (field: keyof ProductErrors) => errors?.[field]?.[0]

  // Props shared by every input: name, starting value, error state and styles.
  // After a failed submit, show what the user typed; otherwise the product's data.
  const fieldProps = (field: keyof ProductErrors) => ({
    name: field,
    defaultValue: state.values?.[field] ?? product?.[field]?.toString() ?? '',
    'aria-invalid': Boolean(error(field)),
    className: `rounded-lg border px-3 py-2 transition-colors ${
      error(field) ? 'border-red-600 bg-red-50' : 'border-gray-300 hover:border-gray-400'
    }`,
  })

  const isSuccess = state.status === 'success'
  const message = clientErrors ? 'Please fix the errors below.' : state.message

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div role="status" aria-live="polite">
        {message && (
          <p
            className={`rounded-lg p-3 ${
              isSuccess && !clientErrors ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message} {isSuccess && !clientErrors && 'Redirecting…'}
          </p>
        )}
      </div>

      <Field label="Title" required error={error('title')}>
        <input {...fieldProps('title')} required />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Price ($)" required error={error('price')}>
          <input {...fieldProps('price')} type="number" step="0.01" min="0" required />
        </Field>

        <Field label="Category" required error={error('category')}>
          <select {...fieldProps('category')} required>
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.replace(/-/g, ' ')}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Rating (0–5)" error={error('rating')}>
          <input {...fieldProps('rating')} type="number" step="0.1" min="0" max="5" />
        </Field>

        <Field label="Stock" error={error('stock')}>
          <input {...fieldProps('stock')} type="number" step="1" min="0" />
        </Field>
      </div>

      <Field label="Brand" error={error('brand')}>
        <input {...fieldProps('brand')} />
      </Field>

      <Field label="Description" error={error('description')}>
        <textarea {...fieldProps('description')} rows={4} />
      </Field>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending || isSuccess}
          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? 'Saving…' : product ? 'Save changes' : 'Add product'}
        </button>
        <Link
          href={product ? `/products/${product.id}` : '/products'}
          className="rounded-lg px-2 py-2 text-gray-700 hover:underline"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}

// The <label> wraps the input, so the label text and the error are both read
// out by screen readers when the input is focused.
function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-medium">
        {label}
        {required && (
          <span className="text-red-600" aria-hidden="true">
            {' '}*
          </span>
        )}
      </span>
      {children}
      {error && <span className="text-sm text-red-700">{error}</span>}
    </label>
  )
}
