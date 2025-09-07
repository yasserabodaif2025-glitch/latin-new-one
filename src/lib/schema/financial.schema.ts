import { z } from 'zod'

export const financialReceiptSchema = z.object({
  id: z.number().optional(),
  studentId: z.number().min(1),
  studentName: z.string().nonempty(),
  amount: z.number().min(0.01),
  date: z.string().nonempty(),
  description: z.string().optional(),
  type: z.enum(['payment', 'charge', 'expense']),
  createdBy: z.string().nonempty(),
})

export type FinancialReceiptSchema = z.infer<typeof financialReceiptSchema>

export const financialTransactionSchema = z.object({
  id: z.number().optional(),
  studentId: z.number().optional(),
  amount: z.number().min(0.01),
  date: z.string().nonempty(),
  type: z.enum(['payment', 'charge', 'expense', 'balance', 'safe-closure']),
  description: z.string().optional(),
  createdBy: z.string().nonempty(),
})

export type FinancialTransactionSchema = z.infer<typeof financialTransactionSchema>
