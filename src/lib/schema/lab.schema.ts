import { z } from 'zod'

export const labSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty(),
  branchId: z.number().min(1),
  capacity: z.number().min(1),
  type: z.string().nonempty(),
})

export type LabSchema = z.infer<typeof labSchema>
