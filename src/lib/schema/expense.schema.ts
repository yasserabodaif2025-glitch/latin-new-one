import { z } from 'zod'

export const ExpenseSchema = z.object({
  fromSafeId: z.number().min(1, 'Required'),
  accountCode: z.string().min(1, 'Required'),
  amount: z.number().min(0.01, 'Required'),
  description: z.string().min(1, 'Required'),
  expenseDate: z.string().min(1, 'Required'),
})

export type ExpenseSchemaType = z.infer<typeof ExpenseSchema>
