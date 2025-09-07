import { z } from 'zod'

export const lecturerSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty(),
  email: z.string().nonempty(),
  password: z.string().optional(),
  phone: z.string().regex(/^01[0125]\d{8}$/, 'wrong phone formate'),
  address: z.string().nonempty(),
  nationalId: z.string().nonempty(),
  cityId: z.number(),
  coursesIds: z.array(z.string()).min(1, 'At least one course is required'),
  salary: z.number().optional(),
  salaryTypeId: z.number().optional(),
})

export type LecturerSchema = z.infer<typeof lecturerSchema>
