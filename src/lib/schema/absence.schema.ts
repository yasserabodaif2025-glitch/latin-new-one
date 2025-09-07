import { z } from 'zod'

export const absenceSchema = z.object({
  studentName: z.string().min(3, {
    message: 'Student name must be at least 3 characters.',
  }),
  date: z.string().min(1, {
    message: 'Date is required.',
  }),
  reason: z.string().min(3, {
    message: 'Reason must be at least 3 characters.',
  }),
  notes: z.string().optional(),
})

export type AbsenceFormValues = z.infer<typeof absenceSchema>

export interface Absence extends AbsenceFormValues {
  id: string
  createdAt: string
  updatedAt: string
}
