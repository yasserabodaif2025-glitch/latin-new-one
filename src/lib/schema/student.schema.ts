import { z } from 'zod'

export const studentSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  areaId: z.number(),
  birthdate: z.date(),
  educationalQualificationDescriptionId: z.number(),
  educationalQualificationTypeId: z.number(),
  educationalQualificationIssuerId: z.number(),
  studentSourceId: z.number(),
})

export type StudentSchema = z.infer<typeof studentSchema>
