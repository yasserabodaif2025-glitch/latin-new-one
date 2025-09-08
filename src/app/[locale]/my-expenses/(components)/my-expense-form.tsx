'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SaveIcon } from 'lucide-react'
import { useState } from 'react'
import { createMyExpense } from '../../expenses/expense.action'
import { toast } from 'sonner'

const MyExpenseSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'المبلغ يجب أن يكون رقمًا' })
    .positive('المبلغ يجب أن يكون أكبر من صفر')
    .min(1, 'الحد الأدنى للمبلغ هو 1'),
  description: z
    .string({ required_error: 'الوصف مطلوب' })
    .min(3, 'الوصف يجب أن لا يقل عن 3 أحرف')
    .max(500, 'الوصف يجب أن لا يزيد عن 500 حرف'),
  category: z
    .string()
    .max(100, 'الفئة يجب أن لا تزيد عن 100 حرف')
    .optional(),
})

type MyExpenseSchemaType = z.infer<typeof MyExpenseSchema>

export default function MyExpenseForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<MyExpenseSchemaType>({
    resolver: zodResolver(MyExpenseSchema),
    defaultValues: {
      amount: 0,
      description: '',
      category: '',
    },
  })

  const onSubmit = async (data: MyExpenseSchemaType) => {
    try {
      setIsLoading(true)
      await createMyExpense(data)

      toast.success('تم الحفظ بنجاح', {
        description: 'تم تسجيل المصروف الشخصي بنجاح.',
      })

      form.reset()
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message || err?.message
      toast.error('لم يتم الحفظ', {
        description: apiMessage || 'حدث خطأ أثناء إنشاء المصروف الشخصي.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">إضافة مصروف شخصي</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المبلغ</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="أدخل المبلغ (مثال: 100)"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الفئة (اختياري)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="فئة المصروف (مثال: مواصلات، ضيافة)" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الوصف</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="اكتب وصفًا موجزًا للمصروف" rows={3} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={isLoading} className="min-w-32">
              <SaveIcon className="mr-2 h-4 w-4" />
              {isLoading ? 'جارٍ الحفظ...' : 'حفظ المصروف'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
