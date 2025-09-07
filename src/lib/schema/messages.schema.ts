import { z } from 'zod'

export const messageSchema = z.object({
  id: z.number().optional(),
  // phone: z.string().regex(/^01[0125]\d{8}$/, 'wrong phone formate'),
  phone: z.string(),
  message: z.string(),
})

export type MessageSchema = z.infer<typeof messageSchema>
