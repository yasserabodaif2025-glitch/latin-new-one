import { z } from 'zod'

export const qualificationDescriptionSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty(),
  description: z.string().optional(),
})

export type QualificationDescriptionSchema = z.infer<typeof qualificationDescriptionSchema>
