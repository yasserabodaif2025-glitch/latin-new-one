import { z } from 'zod'

export const loginSchema = z.object({
  userNameOrEmail: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
})

export type LoginFormData = z.infer<typeof loginSchema>
