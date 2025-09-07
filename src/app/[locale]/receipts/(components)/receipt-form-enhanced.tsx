'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Receipt,
  Printer,
  MessageCircle,
  Save,
  User,
  Calendar,
  DollarSign,
  Ban,
  AlertCircle,
} from 'lucide-react'
import Image from 'next/image'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { ReceiptSchema } from '@/lib/schema/receipt.schema'
import { getStudents, getStudentBalance } from '../../students/student.action'
import { createReceipt, getReceipts, cancelReceipt } from '../receipt.action'
import { IStudent } from '../../students/(components)/student.interface'
import { IStudentBalance } from './receipt.interface'

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

export default function ReceiptFormEnhanced() {
  const t = useTranslations('receipt')
  const [isLoading, setIsLoading] = useState(false)
  const [students, setStudents] = useState<IStudent[]>([])
  const [enrollments, setEnrollments] = useState<IStudentBalance[]>([])
  const [employeeCode, setEmployeeCode] = useState<string>('')
  const [receiptNumber, setReceiptNumber] = useState('')
  const [lastCreatedReceipt, setLastCreatedReceipt] = useState<any>(null)
  const [todayReceipts, setTodayReceipts] = useState<any[]>([])
  const receiptRef = useRef<HTMLDivElement>(null)

  // Fetch today's receipts for the current employee
  useEffect(() => {
    const fetchTodayReceipts = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]
        const response = await getReceipts()
        const allReceipts = response?.data || []

        // Filter receipts for today and current employee
        const filteredReceipts = allReceipts.filter((receipt: any) => {
          const receiptDate = new Date(receipt.createdAt).toISOString().split('T')[0]
          return receiptDate === today && receipt.employeeCode === employeeCode
        })

        setTodayReceipts(filteredReceipts)
      } catch (error) {
        console.error("Failed to fetch today's receipts:", error)
      }
    }

    if (employeeCode) {
      fetchTodayReceipts()
    }
  }, [employeeCode, lastCreatedReceipt]) // Refresh when new receipt is created

  const form = useForm<ReceiptSchema>({
    resolver: zodResolver(ReceiptSchema),
    defaultValues: {
      amount: undefined,
      studentId: undefined,
      receiptType: undefined,
      enrollmentId: undefined,
      serviceType: undefined,
      description: '',
    },
  })

  const receiptType = form.watch('receiptType')
  const studentId = form.watch('studentId')
  const enrollmentId = form.watch('enrollmentId')
  // Watch form values for reactivity
  form.watch(['amount', 'studentId', 'enrollmentId'])

  const enrollment = enrollments?.find(
    (enrollment) => Number(enrollment?.enrollmentId) === Number(enrollmentId)
  )

  // Generate receipt number
  useEffect(() => {
    const generateReceiptNumber = async () => {
      try {
        const res = await getReceipts()
        const receipts = res?.data || []
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
      } catch {
        setReceiptNumber('')
      }
    }
    generateReceiptNumber()
  }, [])

  // Get employee code
  useEffect(() => {
    const userName = localStorage.getItem('userName')
    setEmployeeCode(userName || 'EMP001')
  }, [])

  // Load students
  useEffect(() => {
    getStudents().then((res) => setStudents(res.data))
  }, [])

  // Load enrollments when student and receipt type change
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (studentId && receiptType === 'student_payment') {
        try {
          setIsLoading(true)
          const result = await getStudentBalance(studentId)
          setEnrollments(result)
        } catch {
          setEnrollments([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setEnrollments([])
      }
    }
    fetchEnrollments()
  }, [studentId, receiptType])

  const onSubmit = async (data: ReceiptSchema) => {
    try {
      setIsLoading(true)
      await createReceipt({ ...data, receiptNumber })

      const selectedStudent = students.find((s) => s.id === Number(data.studentId))
      setLastCreatedReceipt({
        ...data,
        receiptNumber,
        studentName: selectedStudent?.name,
        studentPhone: selectedStudent?.phone,
        employeeCode,
        createdAt: new Date().toISOString(),
      })

      toast.success('تم إنشاء الإيصال بنجاح')
      form.reset()
    } catch {
      toast.error('فشل في إنشاء الإيصال')
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleWhatsApp = () => {
    if (!lastCreatedReceipt?.studentPhone) {
      toast.error('رقم هاتف الطالب غير متوفر')
      return
    }

    const message = `إيصال رقم: ${receiptNumber}\\nالطالب: ${lastCreatedReceipt.studentName}\\nالمبلغ: ${formatEGP(lastCreatedReceipt.amount)}\\nالتاريخ: ${formatDate(new Date(lastCreatedReceipt.createdAt))}`
    const phoneNumber = lastCreatedReceipt.studentPhone.replace(/[^0-9]/g, '')
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const handleCancelReceipt = async (receiptNumber: string) => {
    try {
      await cancelReceipt(receiptNumber)
      toast.success('تم إلغاء الإيصال بنجاح')
      // تحديث القائمة
      const response = await getReceipts()
      const allReceipts = response?.data || []
      const today = new Date().toISOString().split('T')[0]
      const filteredReceipts = allReceipts.filter((receipt: any) => {
        const receiptDate = new Date(receipt.createdAt).toISOString().split('T')[0]
        return receiptDate === today && receipt.employeeCode === employeeCode
      })
      setTodayReceipts(filteredReceipts)
    } catch {
      toast.error('فشل في إلغاء الإيصال')
    }
  }

  return (
    <div className="space-y-6">
      {/* Receipt Form */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            إنشاء إيصال مالي جديد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-12 items-end gap-3"
          >
            {/* Receipt Header Info */}
            <div className="col-span-12 grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-3">
              <div className="flex flex-col">
                <Label className="text-xs font-medium">رقم الإيصال</Label>
                <div className="flex items-center gap-1">
                  <Receipt className="h-3 w-3 text-gray-500" />
                  <span className="font-mono text-sm font-semibold">{receiptNumber}</span>
                </div>
              </div>

              <div className="flex flex-col">
                <Label className="text-xs font-medium">كود الموظف</Label>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 text-gray-500" />
                  <span className="text-sm font-medium">{employeeCode}</span>
                </div>
              </div>

              <div className="flex flex-col">
                <Label className="text-xs font-medium">التاريخ</Label>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-500" />
                  <span className="text-xs">{formatDate(new Date())}</span>
                </div>
              </div>
            </div>

            <Separator className="col-span-12" />

            {/* First Row: Student, Receipt Type, Service Type/Enrollment */}
            <div className="col-span-12 grid grid-cols-12 gap-3">
              {/* Student Selection - First in row */}
              <div className="col-span-5">
                <Label htmlFor="student">الطالب *</Label>
                <Select
                  onValueChange={(value) => form.setValue('studentId', Number(value))}
                  value={String(studentId || '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الطالب" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={String(student.id)}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {student.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Receipt Type */}
              <div className="col-span-3">
                <Label htmlFor="receiptType">نوع الإيصال *</Label>
                <Select
                  onValueChange={(value) => {
                    form.setValue('receiptType', value as any)
                    form.setValue('enrollmentId', undefined)
                    form.setValue('serviceType', '')
                  }}
                  value={receiptType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الإيصال" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student_payment">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        سداد طالب
                      </div>
                    </SelectItem>
                    <SelectItem value="service_charge">
                      <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4" />
                        رسوم خدمة
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Service Type (for service charge) or Enrollment */}
              <div className="col-span-4">
                {receiptType === 'service_charge' ? (
                  <div>
                    <Label htmlFor="serviceType">نوع الخدمة *</Label>
                    <Select
                      onValueChange={(value) => form.setValue('serviceType', value)}
                      value={form.getValues('serviceType') || ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الخدمة" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          'حساب كورس',
                          'تحديد مستوى',
                          'شهادة',
                          'استرداد',
                          'حضور ولي امر',
                          'كتاب',
                          'مذكرة',
                          'أخرى',
                        ].map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  studentId && (
                    <div>
                      <Label htmlFor="enrollment">التسجيل *</Label>
                      <Select
                        onValueChange={(value) => form.setValue('enrollmentId', Number(value))}
                        value={String(enrollmentId || '')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر التسجيل" />
                        </SelectTrigger>
                        <SelectContent>
                          {enrollments.map((enrollment) => (
                            <SelectItem
                              key={enrollment.enrollmentId}
                              value={String(enrollment.enrollmentId)}
                            >
                              <div className="space-y-1">
                                <div className="font-medium">
                                  {enrollment.courseName} - {enrollment.levelName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  المجموعة: {enrollment.groupName}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Second Row: Payment Details and Amount */}
            <div className="col-span-12 grid grid-cols-12 items-start gap-3">
              {/* Payment Details */}
              {receiptType === 'student_payment' && enrollment && (
                <div className="col-span-9 grid grid-cols-4 gap-2 rounded-lg bg-blue-50 p-3">
                  <div className="text-center">
                    <Label className="text-xs text-gray-600">المبلغ الإجمالي</Label>
                    <div className="text-sm font-semibold text-blue-600">
                      {formatEGP((enrollment as any).totalAmount || 0)}
                    </div>
                  </div>
                  <div className="text-center">
                    <Label className="text-xs text-gray-600">المدفوع سابقاً</Label>
                    <div className="text-sm font-semibold text-green-600">
                      {formatEGP((enrollment as any).paidAmount || 0)}
                    </div>
                  </div>
                  <div className="text-center">
                    <Label className="text-xs text-gray-600">المتبقي</Label>
                    <div className="text-sm font-semibold text-red-600">
                      {formatEGP((enrollment as any).remainingBalance || 0)}
                    </div>
                  </div>
                  {/* Amount Input next to payment details */}
                  <div className="text-center">
                    <Label className="text-xs text-gray-600">المبلغ المدفوع *</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
                      <Input
                        type="number"
                        {...form.register('amount', { valueAsNumber: true })}
                        className="pl-10 text-center"
                        placeholder=""
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 transform text-xs text-gray-500">
                        ج.م
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Amount Input for service charge */}
              {receiptType === 'service_charge' && (
                <div className="col-span-9">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="amount">المبلغ المدفوع *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
                        <Input
                          type="number"
                          {...form.register('amount', { valueAsNumber: true })}
                          className="pl-10"
                          placeholder=""
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 transform text-xs text-gray-500">
                          ج.م
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">الوصف (اختياري)</Label>
                      <Input {...form.register('description')} placeholder="وصف مختصر للخدمة" />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="col-span-3">
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      جاري...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      حفظ
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* نموذج الإيصال للطباعة */}
      <AnimatePresence>
        {lastCreatedReceipt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="mx-auto max-w-md">
              <CardContent className="p-4">
                <div ref={receiptRef} className="receipt-print space-y-4">
                  {/* Receipt Header */}
                  <div className="border-b pb-4 text-center">
                    <Image
                      src="/images/logo.png"
                      alt="الأكاديمية اللاتينية"
                      width={64}
                      height={64}
                      className="mx-auto mb-2 h-16 w-auto"
                    />
                    <h2 className="text-xl font-bold">الأكاديمية اللاتينية</h2>
                    <p className="mt-1 text-sm text-gray-600">Latin Academy</p>
                    <div className="mt-2 text-xs text-gray-500">
                      <p>فرع المنصورة - شارع جيهان</p>
                      <p>ت: 01234567890</p>
                    </div>
                  </div>

                  {/* Receipt Title */}
                  <div className="text-center">
                    <div className="inline-block rounded-full bg-gray-100 px-4 py-1 text-sm font-medium">
                      إيصال{' '}
                      {lastCreatedReceipt.receiptType === 'student_payment'
                        ? 'سداد طالب'
                        : 'رسوم خدمة'}
                    </div>
                    <div className="mt-2 font-mono text-2xl font-bold text-gray-700">
                      {lastCreatedReceipt.receiptNumber}
                    </div>
                  </div>

                  {/* Receipt Details */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-gray-500">الطالب</div>
                        <div className="font-medium">{lastCreatedReceipt.studentName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">رقم الهاتف</div>
                        <div className="font-medium">
                          {lastCreatedReceipt.studentPhone || 'غير متوفر'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">التاريخ</div>
                        <div className="font-medium">
                          {formatDate(new Date(lastCreatedReceipt.createdAt))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">الموظف</div>
                        <div className="font-medium">{lastCreatedReceipt.employeeCode}</div>
                      </div>
                    </div>

                    {lastCreatedReceipt.enrollmentId && (
                      <div className="mt-4 border-t pt-4">
                        <div className="text-xs text-gray-500">بيانات التسجيل</div>
                        <div className="mt-1 text-sm">
                          <span className="font-medium">
                            {lastCreatedReceipt.courseName} - {lastCreatedReceipt.levelName}
                          </span>
                          <span className="mx-2 text-gray-300">|</span>
                          <span className="text-gray-600">
                            المجموعة: {lastCreatedReceipt.groupName}
                          </span>
                        </div>
                      </div>
                    )}

                    {lastCreatedReceipt.serviceType && (
                      <div className="mt-4 border-t pt-4">
                        <div className="text-xs text-gray-500">نوع الخدمة</div>
                        <div className="mt-1 text-sm font-medium">
                          {lastCreatedReceipt.serviceType}
                        </div>
                        {lastCreatedReceipt.description && (
                          <div className="mt-1 text-sm text-gray-600">
                            {lastCreatedReceipt.description}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-4 border-t pt-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-500">المبلغ المدفوع</div>
                        <div className="mt-1 text-2xl font-bold text-green-600">
                          {formatEGP(lastCreatedReceipt.amount)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Receipt Footer */}
                  <div className="mt-4 space-y-2 text-center text-xs text-gray-500">
                    <p>شكراً لثقتكم في الأكاديمية اللاتينية</p>
                    <p>
                      تم إنشاء هذا الإيصال إلكترونياً - {new Date().toLocaleDateString('ar-EG')}
                    </p>
                    <div className="mt-4">
                      <div className="inline-block w-32 border-t border-gray-200" />
                      <div className="mt-2">توقيع المسؤول</div>
                    </div>
                  </div>
                </div>

                {/* Actions - مخفية عند الطباعة */}
                <div className="print-hidden mt-4 flex gap-2">
                  <Button variant="outline" className="h-8 flex-1 text-xs" onClick={handlePrint}>
                    <Printer className="mr-1 h-3 w-3" />
                    طباعة
                  </Button>
                  {lastCreatedReceipt.studentPhone && (
                    <Button
                      variant="outline"
                      className="h-8 flex-1 bg-green-50 text-xs text-green-700 hover:bg-green-100"
                      onClick={handleWhatsApp}
                    >
                      <MessageCircle className="mr-1 h-3 w-3" />
                      واتساب
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daily Statistics Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            ملخص اليوم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-lg bg-green-50 p-3 text-center">
              <Label className="text-xs text-gray-600">إجمالي التحصيل</Label>
              <div className="text-lg font-bold text-green-600">
                {formatEGP(todayReceipts.reduce((sum, r) => sum + (r.amount || 0), 0))}
              </div>
              <div className="text-xs text-gray-500">{todayReceipts.length} إيصال</div>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-center">
              <Label className="text-xs text-gray-600">سداد الطلاب</Label>
              <div className="text-lg font-bold text-blue-600">
                {formatEGP(
                  todayReceipts
                    .filter((r) => r.receiptType === 'student_payment')
                    .reduce((sum, r) => sum + (r.amount || 0), 0)
                )}
              </div>
              <div className="text-xs text-gray-500">
                {todayReceipts.filter((r) => r.receiptType === 'student_payment').length} إيصال
              </div>
            </div>
            <div className="rounded-lg bg-purple-50 p-3 text-center">
              <Label className="text-xs text-gray-600">رسوم الخدمات</Label>
              <div className="text-lg font-bold text-purple-600">
                {formatEGP(
                  todayReceipts
                    .filter((r) => r.receiptType === 'service_charge')
                    .reduce((sum, r) => sum + (r.amount || 0), 0)
                )}
              </div>
              <div className="text-xs text-gray-500">
                {todayReceipts.filter((r) => r.receiptType === 'service_charge').length} إيصال
              </div>
            </div>
            <div className="rounded-lg bg-orange-50 p-3 text-center">
              <Label className="text-xs text-gray-600">متوسط الإيصال</Label>
              <div className="text-lg font-bold text-orange-600">
                {formatEGP(
                  todayReceipts.length
                    ? todayReceipts.reduce((sum, r) => sum + (r.amount || 0), 0) /
                        todayReceipts.length
                    : 0
                )}
              </div>
              <div className="text-xs text-gray-500">متوسط المبلغ</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Receipts Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Receipt className="h-4 w-4" />
            إيصالات اليوم ({todayReceipts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayReceipts.length > 0 ? (
            <div className="space-y-2">
              {todayReceipts.map((receipt: any) => (
                <div
                  key={receipt.receiptNumber}
                  className={`flex items-center justify-between rounded-lg ${receipt.status === 'cancelled' ? 'bg-red-50' : 'bg-gray-50'} p-2 text-sm transition-colors hover:bg-gray-100`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono">{receipt.receiptNumber}</span>
                    <span>{receipt.studentName}</span>
                    <Badge
                      variant={receipt.receiptType === 'student_payment' ? 'default' : 'secondary'}
                    >
                      {receipt.receiptType === 'student_payment' ? 'سداد طالب' : 'رسوم خدمة'}
                    </Badge>
                    {receipt.status === 'cancelled' && (
                      <Badge variant="destructive" className="animate-pulse">
                        ملغي
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-semibold ${receipt.status === 'cancelled' ? 'text-red-600 line-through' : 'text-green-600'}`}
                    >
                      {formatEGP(receipt.amount)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(receipt.createdAt).toLocaleTimeString('ar-EG', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {receipt.status !== 'cancelled' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-600"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>تأكيد إلغاء الإيصال</AlertDialogTitle>
                            <AlertDialogDescription>
                              هل أنت متأكد من إلغاء إيصال رقم {receipt.receiptNumber}؟
                              <div className="mt-2">
                                <div className="text-sm">
                                  <span className="font-medium">الطالب:</span> {receipt.studentName}
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium">المبلغ:</span>{' '}
                                  {formatEGP(receipt.amount)}
                                </div>
                              </div>
                              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                <AlertCircle className="mb-2 h-4 w-4" />
                                <p>لا يمكن التراجع عن هذا الإجراء.</p>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleCancelReceipt(receipt.receiptNumber)}
                            >
                              إلغاء الإيصال
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-gray-500">لم يتم إنشاء إيصالات اليوم</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
