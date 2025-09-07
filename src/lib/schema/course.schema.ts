import { z } from 'zod'

export const courseLevelSchema = z.object({
  id: z.number().optional(),
  courseId: z.number().optional(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  sessionsDiortion: z.number(),
  sessionsCount: z.number(),
})

export const courseSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty(),
  description: z.string().optional(),
  categoryId: z.number().min(1),
  isActive: z.boolean().default(true).optional(),
  levels: z.array(courseLevelSchema),
})

export type CourseSchema = z.infer<typeof courseSchema>

export type CourseLevelSchema = z.infer<typeof courseLevelSchema>
