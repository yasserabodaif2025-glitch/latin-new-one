import { z } from 'zod'

export const sessionStudentSchema = z.object({
  studentId: z.number(),
  name: z.string(),
  phone: z.string(),
  isPresent: z.boolean(),
  notes: z.string(),
})

export const lectureSchema = z.object({
  id: z.number().optional(),
  roomId: z.number(),
  instructorId: z.number(),
  startTime: z.date(),
  sessionStudents: z.array(sessionStudentSchema),
  groupId: z.number(),
  notes: z.string(),
})

export type LectureSchema = z.infer<typeof lectureSchema>

export type SessionStudentSchema = z.infer<typeof sessionStudentSchema>
