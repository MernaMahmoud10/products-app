import { z } from 'zod'

const productSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.'),
  price: z.coerce
    .number({ error: 'Price must be a number.' })
    .positive('Price must be more than 0.'),
  category: z.string().min(1, 'Category is required.'),
  rating: z.coerce
    .number({ error: 'Rating must be a number.' })
    .min(0, 'Rating must be between 0 and 5.')
    .max(5, 'Rating must be between 0 and 5.')
    .optional(),
  stock: z.coerce
    .number({ error: 'Stock must be a number.' })
    .int('Stock must be a whole number.')
    .min(0, 'Stock cannot be negative.')
    .optional(),
  brand: z.string().trim().optional(),
  description: z.string().trim().optional(),
})

export type ProductErrors = Partial<
  Record<keyof z.infer<typeof productSchema>, string[]>
>

export function parseProduct(formData: FormData) {
  const input: Record<string, string | undefined> = {}
  for (const [key, value] of formData) {
    input[key] = value === '' ? undefined : String(value)
  }

  const result = productSchema.safeParse(input)
  if (result.success) {
    return { data: result.data, errors: undefined }
  }
  return { data: undefined, errors: z.flattenError(result.error).fieldErrors }
}
