"use client"

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReceiptSchema } from '@/lib/schema'
import { createReceipt } from '@/app/[locale]/receipts/receipt.action.ts'
import { getStudent, getStudentBalance } from '../student.action'
import { IStudent } from './student.interface'
import { IStudentBalance } from '@/app/[locale]/receipts/(components)/receipt.interface'
import { toast } from 'sonner'
import { sendMessage } from '@/app/[locale]/messages/messages.action'
import { useTranslations } from 'next-intl'

export function BookingModal({ studentId }: { studentId: number }) {
  const [open, setOpen] = useState(false)
  const [student, setStudent] = useState<IStudent | null>(null)
  const [enrollments, setEnrollments] = useState<IStudentBalance[]>([])
  const [loading, setLoading] = useState(false)
  const t = useTranslations()

  const form = useForm<ReceiptSchema>({
    resolver: zodResolver(ReceiptSchema),
    defaultValues: {
      studentId,
      receiptType: 'student_payment',
      amount: 0,
    },
  })

  const enrollmentId = form.watch('enrollmentId')
  const amount = form.watch('amount') || 0

  const enrollment = useMemo(
    () => enrollments.find((e) => String(e.enrollmentId) === String(enrollmentId)),
    [enrollments, enrollmentId]
  )

  useEffect(() => {
    if (!open) return
    setLoading(true)
    Promise.all([getStudent(studentId), getStudentBalance(studentId)])
      .then(([s, balances]) => {
        setStudent(s)
        setEnrollments(balances ?? [])
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [open, studentId])

  const onSubmit = async (data: ReceiptSchema) => {
    try {
      if (!data.enrollmentId) {
        toast.error(t('booking.chooseGroupFirst'))
        return
      }
      if (amount <= 0) {
        toast.error(t('booking.invalidAmount'))
        return
      }
      setLoading(true)
      await createReceipt(data)

      // Send WhatsApp message summary
      if (student?.phone) {
        const msg = `إيصال دفع\n${t('booking.student')}: ${student.name}\n${t('booking.group')}: ${enrollment?.groupName || ''}\nالدورة: ${enrollment?.courseName || ''} - ${enrollment?.levelName || ''}\n${t('booking.amount')}: ${amount}`
        try {
          await sendMessage({ number: student.phone, message: msg })
        } catch (e) {
          console.warn('sendMessage failed', e)
        }
      }

      toast.success(t('booking.success'))
      form.reset({ studentId, receiptType: 'student_payment', amount: 0, enrollmentId: undefined })
      setOpen(false)
    } catch (e) {
      console.error(e)
      toast.error(t('booking.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">{t('booking.openButton')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('booking.title')}</DialogTitle>
        </DialogHeader>
        {/* Student quick info */}
        {student && (
          <div className="mb-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-md border p-2">
              {t('booking.student')}: {student.name}
            </div>
            {student.phone && (
              <div className="rounded-md border p-2">
                {t('booking.phone')}: {student.phone}
              </div>
            )}
          </div>
        )}
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="enrollmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('booking.group')}</FormLabel>
                    <Select onValueChange={field.onChange} value={String(field.value || '')}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('booking.selectGroup')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {enrollments
                          .filter((e) => (e.remainingBalance ?? 0) > 0)
                          .map((e) => (
                            <SelectItem key={e.enrollmentId} value={String(e.enrollmentId)}>
                              {e.groupName} — {e.courseName} — {e.levelName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('booking.amount')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={amount}
                        onChange={(e) => {
                          const v = Number(e.target.value)
                          const max = enrollment?.remainingBalance ?? Infinity
                          field.onChange(Math.min(v, max))
                        }}
                        disabled={loading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {enrollment && (
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="rounded-md border p-2">{t('booking.totals.total')}: {enrollment.totalFee}</div>
                <div className="rounded-md border p-2">{t('booking.totals.paid')}: {enrollment.paidAmount}</div>
                <div className="rounded-md border p-2">{t('booking.totals.remaining')}: {enrollment.remainingBalance}</div>
              </div>
            )}

            {/* Empty state when no eligible enrollments */}
            {!loading && enrollments.filter((e) => (e.remainingBalance ?? 0) > 0).length === 0 && (
              <div className="rounded-md border bg-muted/40 p-3 text-sm">{t('booking.noEligibleEnrollments')}</div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="text-sm text-muted-foreground">{t('booking.loading')}</div>
            )}

            <DialogFooter>
              <Button
                type="submit"
                disabled={
                  loading ||
                  !form.getValues('enrollmentId') ||
                  (Number(form.getValues('amount')) || 0) <= 0
                }
              >
                {t('booking.saveAndSend')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
