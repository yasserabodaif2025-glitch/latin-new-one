import { z } from 'zod'

export const qualificationTypeSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty(),
  description: z.string().optional(),
})

export type QualificationTypeSchema = z.infer<typeof qualificationTypeSchema>
