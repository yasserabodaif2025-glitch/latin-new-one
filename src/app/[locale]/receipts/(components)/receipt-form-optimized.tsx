'use client'

import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReceiptSchema } from '@/lib/schema'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SaveIcon, PrinterIcon, MessageCircleIcon } from 'lucide-react'
import { useEffect, useState, useRef, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { createReceipt } from '../receipt.action'
import { toast } from 'sonner'
import { useStudents } from '../../students/(components)/useStudents'
import { useStudentBalance } from '../../students/(components)/useStudentBalance'
import useSWR from 'swr'
import { axiosFetcher } from '@/lib/swr-fetchers'

// دالة تنسيق العملة المصرية
const formatEGP = (amount: number) => {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 2,
  }).format(amount)
}

// دالة تنسيق التاريخ الميلادي
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export default function ReceiptFormOptimized() {
  const [showActions, setShowActions] = useState(false)
  const t = useTranslations('receipt')
  const [isLoading, setIsLoading] = useState(false)
  const [employeeCode, setEmployeeCode] = useState<string | null>(null)
  const [receiptNumber, setReceiptNumber] = useState('')
  const [lastCreatedReceipt, setLastCreatedReceipt] = useState<any>(null)
  const receiptRef = useRef<HTMLDivElement>(null)
  const [currentDate, setCurrentDate] = useState('')

  // استخدام SWR للحصول على الطلاب
  const { students, isLoading: studentsLoading } = useStudents()

  // استخدام SWR للحصول على الإيصالات لتوليد الرقم
  const { data: receiptsData } = useSWR(
    'receipts-for-number',
    () => axiosFetcher(`FinancialOperations/receipts/pagination`),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // cache لمدة دقيقة
    }
  )

  const form = useForm<ReceiptSchema>({
    resolver: zodResolver(ReceiptSchema),
    defaultValues: {
      amount: 0,
    },
  })

  const receiptType = form.watch('receiptType')
  const studentId = form.watch('studentId')
  const enrollmentId = form.watch('enrollmentId')
  const amount = form.watch('amount')

  // استخدام hook محسن لجلب رصيد الطالب
  const { balances, isLoading: balanceLoading } = useStudentBalance(
    studentId ? Number(studentId) : null
  )

  // حساب الـ enrollment المحدد
  const enrollment = useMemo(() => {
    return balances?.find(
      (enrollment) => Number(enrollment?.enrollmentId) === Number(enrollmentId)
    )
  }, [balances, enrollmentId])

  // توليد رقم الإيصال التلقائي
  useEffect(() => {
    if (receiptsData?.data) {
      const receipts = receiptsData.data || []
      const year = new Date().getFullYear() % 100
      const yearPrefix = year.toString().padStart(2, '0')
      const currentYearReceipts = receipts.filter((r: any) =>
        r.receiptNumber?.startsWith(yearPrefix)
      )
      let lastNum = 10000
      if (currentYearReceipts.length > 0) {
        const lastReceipt = currentYearReceipts.reduce((a: any, b: any) =>
          a.receiptNumber > b.receiptNumber ? a : b
        )
        const lastReceiptNum = parseInt(lastReceipt.receiptNumber?.slice(2) || '10000', 10)
        lastNum = lastReceiptNum
      }
      setReceiptNumber(yearPrefix + (lastNum + 1))
    }
  }, [receiptsData])

  // جلب userName من localStorage وتعيين التاريخ عند تحميل النموذج
  useEffect(() => {
    const userName = localStorage.getItem('userName')
    setEmployeeCode(userName || null)
    setCurrentDate(formatDate(new Date()))
  }, [])

  const onSubmit = async (data: ReceiptSchema) => {
    try {
      setIsLoading(true)
      await createReceipt({ ...data, receiptNumber })

      // حفظ بيانات الإيصال المُنشأ حديثاً
      const selectedStudent = students.find((s) => s.id === Number(data.studentId))
      setLastCreatedReceipt({
        ...data,
        receiptNumber,
        studentName: selectedStudent?.name,
        studentPhone: selectedStudent?.phone,
        employeeCode,
        createdAt: new Date().toISOString(),
      })

      toast.success('Success', {
        description: 'Receipt created successfully.',
      })
      form.reset()
      setShowActions(true)
    } catch {
      toast.error('Error', {
        description: 'Failed to create receipt.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // دالة طباعة الإيصال فقط
  const handlePrint = () => {
    if (receiptRef.current) {
      const printContent = receiptRef.current.innerHTML
      const originalContent = document.body.innerHTML
      document.body.innerHTML = printContent
      window.print()
      document.body.innerHTML = originalContent
      window.location.reload()
    }
  }

  // دالة إرسال عبر واتساب
  const handleWhatsApp = () => {
    if (!lastCreatedReceipt?.studentPhone) {
      toast.error('خطأ', {
        description: 'رقم هاتف الطالب غير متوفر',
      })
      return
    }

    const message = `إيصال رقم: ${receiptNumber}\nالطالب: ${lastCreatedReceipt.studentName}\nالمبلغ: ${formatEGP(lastCreatedReceipt.amount)}\nالتاريخ: ${formatDate(new Date(lastCreatedReceipt.createdAt))}\nالموظف: ${employeeCode || ''}`
    const phoneNumber = lastCreatedReceipt.studentPhone.replace(/[^0-9]/g, '')
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-wrap gap-2 rounded-lg border bg-white p-4 shadow-sm"
      >
        {/* رقم الإيصال التلقائي */}
        <div className="w-40">
          <FormLabel className="text-xs">رقم الإيصال</FormLabel>
          <Input value={receiptNumber} readOnly className="h-8 bg-gray-50 text-xs" />
        </div>
        
        {/* كود الموظف */}
        {employeeCode && (
          <div className="w-40">
            <FormLabel className="text-xs">كود الموظف</FormLabel>
            <Input value={employeeCode} readOnly className="h-8 bg-gray-50 text-xs" />
          </div>
        )}
        
        {/* التاريخ الميلادي */}
        <div className="w-48">
          <FormLabel className="text-xs">التاريخ</FormLabel>
          <Input value={currentDate} readOnly className="h-8 bg-gray-50 text-xs" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">{t('student')}</FormLabel>
                <Select onValueChange={field.onChange} value={String(field?.value)}>
                  <FormControl>
                    <SelectTrigger className="h-8 w-48 text-xs">
                      <SelectValue placeholder={studentsLoading ? 'جاري التحميل...' : t('selectStudent')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {students
                      .filter((s) => s?.id !== undefined && s?.id !== null)
                      .map((student) => (
                        <SelectItem key={String(student.id)} value={String(student.id)}>
                          {student.name}
                        </SelectItem>
                      ))}
                    <SelectSeparator />
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FormField
            control={form.control}
            name="receiptType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">{t('receiptType')}</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    form.setValue('amount', 0)
                    form.setValue('enrollmentId', undefined)
                    form.setValue('serviceType', '')
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-8 w-40 text-xs">
                      <SelectValue placeholder={t('selectReceiptType')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="student_payment">
                      {t('receiptTypeStudentPayment')}
                    </SelectItem>
                    <SelectItem value="service_charge">{t('receiptTypeServiceCharge')}</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </motion.div>

        <AnimatePresence>
          {receiptType === 'service_charge' && (
            <motion.div
              initial={{ opacity: 0, width: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, width: 'auto', overflow: 'visible' }}
              exit={{ opacity: 0, width: 0, overflow: 'hidden' }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1"
            >
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="whitespace-nowrap text-xs">{t('serviceType')}</FormLabel>
                    <Input type="text" {...field} className="h-8 w-32 text-xs" />
                  </FormItem>
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {receiptType === 'student_payment' && (
            <motion.div
              initial={{ opacity: 0, width: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, width: 160, overflow: 'visible' }}
              exit={{ opacity: 0, width: 0, overflow: 'hidden' }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1"
            >
              <FormField
                control={form.control}
                name="enrollmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">{t('enrollment')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                      <FormControl>
                        <SelectTrigger className="h-8 w-40 text-xs">
                          <SelectValue placeholder={balanceLoading ? 'جاري التحميل...' : t('selectEnrollment')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {balances
                          .filter((e) => e?.enrollmentId !== undefined && e?.enrollmentId !== null)
                          .map((enrollment) => (
                            <SelectItem
                              key={String(enrollment.enrollmentId)}
                              value={String(enrollment.enrollmentId)}
                            >
                              {enrollment.groupName} - {enrollment.courseName} -{' '}
                              {enrollment.levelName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2">
          <AnimatePresence>
            {receiptType === 'student_payment' && enrollmentId && (
              <motion.div
                initial={{ opacity: 0, width: 0, overflow: 'hidden' }}
                animate={{ opacity: 1, width: 'auto', overflow: 'visible' }}
                exit={{ opacity: 0, width: 0, overflow: 'hidden' }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-between gap-2"
              >
                <h4 className="text-xs font-medium">{t('paid')}</h4>
                <Badge className="mb-1 text-xs" variant="outline">
                  {formatEGP(enrollment?.paidAmount || 0)}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">{t('amountPaid')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="h-8 w-28 text-xs"
                      value={amount}
                      onChange={(e) => {
                        const value = Number(e.target.value)
                        if (receiptType === 'student_payment' && enrollmentId) {
                          if (value > (enrollment?.remainingBalance ?? 0)) {
                            toast.error('Amount is greater than remaining balance')
                            field.onChange(enrollment?.remainingBalance ?? 0)
                          } else {
                            field.onChange(value)
                          }
                        } else {
                          field.onChange(value)
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </motion.div>

          <AnimatePresence>
            {receiptType === 'student_payment' && enrollmentId && (
              <motion.div
                initial={{ opacity: 0, width: 0, overflow: 'hidden' }}
                animate={{ opacity: 1, width: 'auto', overflow: 'visible' }}
                exit={{ opacity: 0, width: 0, overflow: 'hidden' }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-between gap-2"
              >
                <h4 className="text-xs font-medium">المتبقي</h4>
                <Badge className="mb-1 text-xs" variant="outline">
                  {formatEGP(
                    enrollment?.remainingBalance ? enrollment?.remainingBalance - amount : 0
                  )}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: -0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-end gap-2"
        >
          <Button type="submit" className="h-8 text-xs" disabled={isLoading}>
            <SaveIcon className="mr-1 h-3 w-3" />
            {isLoading ? 'جاري الحفظ...' : t('save')}
          </Button>
          {showActions && (
            <>
              <Button type="button" variant="outline" className="h-8 text-xs" onClick={handlePrint}>
                <PrinterIcon className="mr-1 h-3 w-3" />
                طباعة
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-8 bg-green-50 text-xs text-green-700 hover:bg-green-100"
                onClick={handleWhatsApp}
              >
                <MessageCircleIcon className="mr-1 h-3 w-3" />
                واتساب
              </Button>
            </>
          )}
        </motion.div>
      </form>

      {/* نموذج الإيصال للطباعة */}
      {lastCreatedReceipt && (
        <div ref={receiptRef} className="mx-auto mt-2 max-w-md rounded border bg-white p-3 text-xs">
          <div className="mb-2 flex items-center justify-between gap-2 border-b pb-2">
            <div className="flex items-center gap-2">
              <img src="/assets/logo.webp" alt="logo" className="h-10 w-10 object-contain" />
              <div>
                <h2 className="text-sm font-bold leading-none">الأكاديمية اللاتينية</h2>
                <p className="text-[11px] text-gray-600">إيصال استلام</p>
              </div>
            </div>

            <div className="text-right text-[11px]">
              <div>
                <span className="font-medium">رقم الإيصال:</span>{' '}
                <span>{lastCreatedReceipt.receiptNumber}</span>
              </div>
              <div className="mt-0.5">
                <span className="font-medium">التاريخ:</span>{' '}
                <span>{formatDate(new Date(lastCreatedReceipt.createdAt))}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span className="font-medium">الطالب:</span>
              <span className="max-w-[10rem] truncate text-right">
                {lastCreatedReceipt.studentName}
              </span>
            </div>

            <span className="text-gray-300">|</span>

            <div className="flex items-center gap-1 whitespace-nowrap">
              <span className="font-medium">الهاتف:</span>
              <span>{lastCreatedReceipt.studentPhone || 'غير متوفر'}</span>
            </div>

            <span className="text-gray-300">|</span>

            <div className="flex items-center gap-1 whitespace-nowrap">
              <span className="font-bold">المبلغ:</span>
              <span className="text-right font-bold">{formatEGP(lastCreatedReceipt.amount)}</span>
            </div>

            <span className="text-gray-300">|</span>

            <div className="flex items-center gap-1 whitespace-nowrap">
              <span className="font-medium">النوع:</span>
              <span>
                {lastCreatedReceipt.receiptType === 'student_payment' ? 'دفع طالب' : 'رسوم خدمة'}
              </span>
            </div>

            {lastCreatedReceipt.serviceType && (
              <>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <span className="font-medium">الخدمة:</span>
                  <span>{lastCreatedReceipt.serviceType}</span>
                </div>
              </>
            )}

            <span className="text-gray-300">|</span>

            <div className="flex items-center gap-1 whitespace-nowrap">
              <span className="font-medium">الموظف:</span>
              <span>{lastCreatedReceipt.employeeCode}</span>
            </div>
          </div>

          <div className="mt-2 border-t pt-1 text-center text-xs text-gray-500">
            <p>شكراً لكم</p>
          </div>

          <div className="print-hidden mt-2 flex gap-1">
            <Button
              type="button"
              variant="outline"
              className="h-6 flex-1 text-xs"
              onClick={handlePrint}
            >
              <PrinterIcon className="mr-1 h-3 w-3" />
              طباعة
            </Button>
            {lastCreatedReceipt.studentPhone && (
              <Button
                type="button"
                variant="outline"
                className="h-6 flex-1 bg-green-50 text-xs text-green-700 hover:bg-green-100"
                onClick={handleWhatsApp}
              >
                <MessageCircleIcon className="mr-1 h-3 w-3" />
                واتساب
              </Button>
            )}
          </div>
        </div>
      )}
    </Form>
  )
}