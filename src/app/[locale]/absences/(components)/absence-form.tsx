'use client'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const absenceFormSchema = z.object({
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

type AbsenceFormValues = z.infer<typeof absenceFormSchema>

export default function AbsenceForm() {
  const t = useTranslations('Absences')
  // using sonner toast directly

  const form = useForm<AbsenceFormValues>({
    resolver: zodResolver(absenceFormSchema),
    defaultValues: {
      studentName: '',
      date: '',
      reason: '',
      notes: '',
    },
  })

  async function onSubmit(data: AbsenceFormValues) {
    try {
      // TODO: Add your API call here
      // await createAbsence(data)

      form.reset()
      // use sonner API: toast.success / toast.error
      toast.success(`${t('absenceAdded')} - ${t('absenceAddedDescription')}`)
    } catch (error) {
      toast.error(`${t('error')}: ${t('errorAddingAbsence')}`)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-6 space-y-4">
        <div className="flex flex-wrap items-end gap-2">
          <FormField
            control={form.control}
            name="studentName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder={t('studentName')} className="w-40" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="date" className="w-40" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder={t('reason')} className="w-40" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder={t('notes')} className="w-48" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className={cn(
              'min-w-[100px]',
              form.formState.isSubmitting && 'cursor-not-allowed opacity-50'
            )}
          >
            {form.formState.isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                {t('adding')}
              </div>
            ) : (
              t('addAbsence')
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
