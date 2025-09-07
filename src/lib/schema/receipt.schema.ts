import { z } from 'zod'

export const ReceiptSchema = z.object({
  id: z.number().optional(),
  branchId: z.coerce.number().optional(),
  studentId: z.coerce.number({
    required_error: 'Student is required',
    invalid_type_error: 'Student must be selected',
  }),
  enrollmentId: z.coerce.number().optional(),
  receiptNumber: z.string().optional(),
  receiptType: z.enum(['student_payment', 'service_charge'], {
    required_error: 'Receipt type is required.',
    invalid_type_error: 'Invalid receipt type',
  }),
  date: z.string().optional(),
  amount: z
    .number({
      required_error: 'Amount is required.',
      invalid_type_error: 'Amount must be a number',
    })
    .positive({ message: 'Amount must be positive.' }),
  description: z.string().optional(),
  serviceType: z.string().optional(),
})

export type ReceiptSchema = z.infer<typeof ReceiptSchema>
