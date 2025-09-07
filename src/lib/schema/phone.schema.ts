import { z } from 'zod'

export const phoneSchema = z.object({
  phone: z
    .string()
    .nonempty('Phone number is required')
    .regex(/^01[0125]\d{8}$/, 'Invalid phone number format'),
})

export type PhoneSchema = z.infer<typeof phoneSchema>
