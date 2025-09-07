import { z } from 'zod'

export const citySchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty(),
  description: z.string().optional(),
})

export type CitySchema = z.infer<typeof citySchema>
