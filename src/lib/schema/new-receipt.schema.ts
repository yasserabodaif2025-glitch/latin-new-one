import { z } from 'zod'

export const NewReceiptSchema = z.object({
  id: z.number().optional(),
  branchId: z.coerce.number().optional(),
  studentId: z.coerce.number().optional(),
  enrollmentId: z.coerce.number().optional(),
  receiptNumber: z.string().optional(),
  receiptType: z.enum(['student_payment', 'service_charge'], {
    required_error: 'Receipt type is required.',
  }),
  date: z.date().optional(),
  amount: z.coerce
    .number({ required_error: 'Amount is required.' })
    .positive({ message: 'Amount must be positive.' }),
  description: z.string().optional(),
  serviceType: z.string().optional(),
})

export type NewReceiptSchema = z.infer<typeof NewReceiptSchema>
