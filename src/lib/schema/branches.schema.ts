import { z } from 'zod'

export const branchSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty(),
  address: z.string().optional(),
  areaId: z.number().min(1),
})

export type BranchSchema = z.infer<typeof branchSchema>
