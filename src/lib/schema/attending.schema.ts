import { z } from 'zod'

export const attendingSchema = z.object({
  // lectureid: z.number().nonempty(),
  studentId: z.number().min(1),
  index: z.number(),
  status: z.string(),
})

export type AttendingSchema = z.infer<typeof attendingSchema>
