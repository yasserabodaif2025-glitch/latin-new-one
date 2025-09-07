import { z } from 'zod'

export const areaSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty(),
  description: z.string().optional(),
  cityId: z.number().min(1),
})

export type AreaSchema = z.infer<typeof areaSchema>
