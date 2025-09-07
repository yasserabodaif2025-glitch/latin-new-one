import { z } from 'zod'

export const messageTemplateSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty(),
  sendAutomatically: z.boolean(),
  courseId: z.number().optional().nullable(),
  body: z.string(),
  trigger: z.string(),
})

export type MessageTemplateSchema = z.infer<typeof messageTemplateSchema>
