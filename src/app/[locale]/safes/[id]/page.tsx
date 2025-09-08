'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { safeSchema, SafeSchemaType, getSafe, updateSafe } from '../safe.action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { useEffect } from 'react'

export default function EditSafePage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)

  const form = useForm<SafeSchemaType>({
    resolver: zodResolver(safeSchema),
    defaultValues: {
      name: '',
      employeeId: 0,
      description: '',
    },
  })

  useEffect(() => {
    const fetchSafe = async () => {
      const safe = await getSafe(id)
      form.reset(safe)
    }
    fetchSafe()
  }, [id, form])

  const onSubmit = async (data: SafeSchemaType) => {
    try {
      await updateSafe(id, data)
      toast.success('تم تعديل الخزنة بنجاح')
      router.push('/safes')
    } catch (error) {
      toast.error('خطأ في تعديل الخزنة')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">تعديل الخزنة</h1>
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
          <Button type="submit">حفظ التعديلات</Button>
        </form>
      </Form>
    </div>
  )
}
