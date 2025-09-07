import { z } from 'zod'

export const courseGroupSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  startDate: z.date().min(new Date()),
  endDate: z.date().min(new Date()),
  instructorId: z.number(),
  courseId: z.number(),
  branchId: z.number(),
  statusId: z.number().default(1),
  studentIds: z.array(z.number()),
  levelId: z.number(),
  roomId: z.number(),
  days: z.array(z.number()),
  startTime: z.string(),
  endTime: z.string(),
  price: z.number().default(0),
  levelName: z.string().default(''),
  levelCode: z.string().default(''),
  levelDuration: z.number().default(0),
  levelSessionsCount: z.number().default(0),
  levelPrice: z.number().default(0),
})

export type CourseGroupSchema = z.infer<typeof courseGroupSchema>
