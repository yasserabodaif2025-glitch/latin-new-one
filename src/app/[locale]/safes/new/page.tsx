'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { safeSchema, SafeSchemaType, createSafe } from '../safe.action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function NewSafePage() {
  const router = useRouter()
  const form = useForm<SafeSchemaType>({
    resolver: zodResolver(safeSchema),
    defaultValues: {
      name: '',
      employeeId: 0,
      description: '',
    },
  })

  const onSubmit = async (data: SafeSchemaType) => {
    try {
      await createSafe(data)
      toast.success('تم إنشاء الخزنة بنجاح')
      router.push('/safes')
    } catch (error) {
      toast.error('خطأ في إنشاء الخزنة')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">إنشاء خزنة جديدة</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الموظف</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الوصف</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">إنشاء</Button>
        </form>
      </Form>
    </div>
  )
}
