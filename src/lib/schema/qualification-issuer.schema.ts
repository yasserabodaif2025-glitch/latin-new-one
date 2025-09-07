import { z } from 'zod'

export const qualificationIssuerSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty(),
  description: z.string().optional(),
})

export type QualificationIssuerSchema = z.infer<typeof qualificationIssuerSchema>
