import { z } from 'zod'

export const categorySchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty(),
  description: z.string().optional(),
})

export type CategorySchema = z.infer<typeof categorySchema>
