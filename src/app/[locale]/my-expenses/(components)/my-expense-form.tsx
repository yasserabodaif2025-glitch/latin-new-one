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
  amount: z.number().min(1, 'المبلغ مطلوب'),
  description: z.string().min(1, 'الوصف مطلوب'),
  category: z.string().optional(),
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
      
      toast.success('نجح', {
        description: 'تم إنشاء المصروف الشخصي بنجاح.',
      })
      
      form.reset()
    } catch {
      toast.error('خطأ', {
        description: 'فشل في إنشاء المصروف الشخصي.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">إضافة مصروف شخصي</h2>
          
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
                      placeholder="أدخل المبلغ"
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
                    <Input {...field} placeholder="فئة المصروف" />
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
                  <Textarea {...field} placeholder="وصف المصروف" rows={3} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={isLoading}>
              <SaveIcon className="h-4 w-4 mr-2" />
              حفظ المصروف
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
