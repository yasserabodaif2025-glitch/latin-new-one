import { z } from 'zod'

export const campaignSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string(),
  startDate: z.date().min(new Date()),
  endDate: z.date().min(new Date()),
  branchIds: z.array(z.number()),
  coursesIds: z.array(z.number()),
})
//   status: z.string(),
//   leads: z.array(
//     z.object({
//       name: z.string(),
//       phone: z.string(),
//       email: z.string().email().optional(),
//       courseId: z.number(),
//     })
//   ),
// })
// .refine((data) => data.startDate < data.endDate, {
//   path: ['endDate'],
//   message: 'End date must be greater than start date',
// })

export type CampaignSchema = z.infer<typeof campaignSchema>
