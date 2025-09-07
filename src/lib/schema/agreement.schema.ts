import { z } from 'zod'

export const agreementSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty(),
})

export type AgreementSchema = z.infer<typeof agreementSchema>
