'use client'

import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExpenseSchema } from '@/lib/schema'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SaveIcon } from 'lucide-react'
import { useState } from 'react'
import { createExpense } from '../expense.action'
import { toast } from 'sonner'

export default function ExpenseForm() {
  const t = useTranslations('expense')
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      fromSafeId: 0,
      accountCode: '',
      amount: 0.01,
      description: '',
      expenseDate: '',
    },
  })

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true)
      await createExpense(data)
      toast.success(t('save'))
      form.reset()
    } catch (error) {
      toast.error('Error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap gap-4">
        <FormField
          control={form.control}
          name="fromSafeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fromSafeId')}</FormLabel>
              <FormControl>
                <Input type="number" {...field} min={1} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accountCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('accountCode')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('amount')}</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min={0.01} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('description')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expenseDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('expenseDate')}</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="mt-4">
          {isLoading ? (
            <SaveIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <SaveIcon className="mr-2 h-4 w-4" />
          )}
          {t('save')}
        </Button>
      </form>
    </Form>
  )
}
