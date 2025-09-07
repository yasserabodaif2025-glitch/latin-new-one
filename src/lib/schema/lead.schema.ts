import { z } from 'zod'

export const leadSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty(),
  email: z.string().email(),
  phone: z.string().regex(/^01[0125]\d{8}$/, 'wrong phone formate'),
  courseId: z.number().min(1),
  campaignId: z.number().optional(),
  areaId: z.number().optional(),
  birthdate: z.date().optional(),
  educationalQualificationDescriptionId: z.number().optional(),
  educationalQualificationTypeId: z.number().optional(),
  educationalQualificationIssuerId: z.number().optional(),
  studentSourceId: z.number().optional(),
  studentId: z.number().optional(),
  status: z.string().optional(),
})

export type LeadSchema = z.infer<typeof leadSchema>
