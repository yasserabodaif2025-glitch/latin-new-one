'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NewReceiptSchema } from '@/lib/schema/new-receipt.schema'
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
import { SaveIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getNewReceipts } from '../new-receipt.action'
import { AnimatePresence, motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { getStudents, getStudentBalance } from '../../students/student.action'
import { createNewReceipt, getStudentFinancialData } from '../new-receipt.action'
import { IStudent } from '../../students/(components)/student.interface'
import { IStudentBalance } from './new-receipt.interface'
import { toast } from 'sonner'

export default function NewReceiptForm() {
  const [showActions, setShowActions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [students, setStudents] = useState<IStudent[]>([])
  const [enrollments, setEnrollments] = useState<IStudentBalance[]>([])
  const [employeeCode, setEmployeeCode] = useState<string | null>(null)
  const [receiptNumber, setReceiptNumber] = useState('')
  const [lastCreatedReceipt, setLastCreatedReceipt] = useState<any>(null)
  const [studentFinancialData, setStudentFinancialData] = useState<any>(null)

  // توليد رقم الإيصال التلقائي عند تحميل النموذج
  useEffect(() => {
    const generateReceiptNumber = async () => {
      try {
        const res = await getNewReceipts()
        const receipts = res?.data || []
        // ابحث عن آخر إيصال في السنة الحالية
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

  // جلب userName من localStorage عند تحميل النموذج
  useEffect(() => {
    const userName = localStorage.getItem('userName')
    setEmployeeCode(userName || null)
  }, [])

  const form = useForm<NewReceiptSchema>({
    resolver: zodResolver(NewReceiptSchema),
    defaultValues: {
      amount: 0,
    },
  })

  const receiptType = form.watch('receiptType')
  const studentId = form.watch('studentId')
  const enrollmentId = form.watch('enrollmentId')
  const amount = form.watch('amount')

  const enrollment = enrollments?.find(
    (enrollment) => Number(enrollment?.enrollmentId) === Number(enrollmentId)
  )

  useEffect(() => {
    const fetchStudentBalance = async () => {
      try {
        setIsLoading(true)
        await getStudentBalance(studentId!)
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    if (studentId) {
      fetchStudentBalance()
    }
  }, [studentId])

  useEffect(() => {
    getStudents().then((res) => setStudents(res.data))
  }, [])

  useEffect(() => {
    const fetchStudentData = async () => {
      if (studentId) {
        try {
          // جلب أرصدة التسجيلات
          const balance = await getStudentBalance(Number(studentId))
          setEnrollments(balance || [])
          
          // جلب البيانات المالية الشاملة للطالب
          const financialData = await getStudentFinancialData(Number(studentId))
          setStudentFinancialData(financialData)
          
          console.log('Student Financial Data:', financialData)
        } catch (error) {
          console.error('Error fetching student data:', error)
          setEnrollments([])
          setStudentFinancialData(null)
        }
      } else {
        setEnrollments([])
        setStudentFinancialData(null)
      }
    }

    fetchStudentData()
  }, [studentId, receiptType])

  const onSubmit = async (data: NewReceiptSchema) => {
    try {
      setIsLoading(true)
      await createNewReceipt({ ...data, receiptNumber })
      
      // حفظ بيانات الإيصال المُنشأ حديثاً
      const selectedStudent = students.find(s => s.id === Number(data.studentId))
      setLastCreatedReceipt({
        ...data,
        receiptNumber,
        studentName: selectedStudent?.name,
        studentPhone: selectedStudent?.phone,
        employeeCode,
        createdAt: new Date().toISOString()
      })
      
      toast.success('نجح', {
        description: 'تم إنشاء الإيصال بنجاح.',
      })
      form.reset({
        amount: 0,
        studentId: undefined,
        enrollmentId: undefined,
        receiptType: undefined,
        serviceType: '',
        description: ''
      })
      setShowActions(true)
      // إعادة توليد رقم إيصال جديد
      const year = new Date().getFullYear() % 100
      const yearPrefix = year.toString().padStart(2, '0')
      try {
        const res = await getNewReceipts()
        const receipts = res?.data || []
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
    } catch {
      toast.error('خطأ', {
        description: 'فشل في إنشاء الإيصال.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // دالة طباعة
  const handlePrint = () => {
    window.print()
  }

  // دالة إرسال عبر واتساب
  const handleWhatsApp = () => {
    if (!lastCreatedReceipt?.studentPhone) {
      toast.error('خطأ', {
        description: 'رقم هاتف الطالب غير متوفر',
      })
      return
    }
    
    const message = `إيصال رقم: ${receiptNumber}\nالطالب: ${lastCreatedReceipt.studentName}\nالمبلغ: ${lastCreatedReceipt.amount}\nالموظف: ${employeeCode || ''}`
    const phoneNumber = lastCreatedReceipt.studentPhone.replace(/[^0-9]/g, '') // إزالة الرموز غير الرقمية
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap gap-4">
        {/* رقم الإيصال التلقائي */}
        <div className="w-full">
          <FormLabel>رقم الإيصال</FormLabel>
          <Input value={receiptNumber} readOnly className="w-60 bg-gray-100" />
        </div>
        {/* كود الموظف */}
        {employeeCode && (
          <div className="w-full">
            <FormLabel>كود الموظف</FormLabel>
            <Input value={employeeCode} readOnly className="w-60 bg-gray-100" />
          </div>
        )}
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
                <FormLabel>الطالب</FormLabel>
                <Select onValueChange={field.onChange} value={String(field?.value)}>
                  <FormControl>
                    <SelectTrigger className="w-60">
                      <SelectValue placeholder="اختر الطالب" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={String(student.id)}>
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
                <FormLabel>نوع الإيصال</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    form.setValue('amount', 0)
                    form.setValue('enrollmentId', undefined)
                    form.setValue('serviceType', '')
                    setEnrollments([])
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الإيصال" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="student_payment">
                      دفع طالب
                    </SelectItem>
                    <SelectItem value="service_charge">رسوم خدمة</SelectItem>
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
                    <FormLabel className="whitespace-nowrap">نوع الخدمة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="اختر نوع الخدمة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="حساب كورس">حساب كورس</SelectItem>
                        <SelectItem value="تجديد مستوى">تجديد مستوى</SelectItem>
                        <SelectItem value="شهادة">شهادة</SelectItem>
                        <SelectItem value="استرداد">استرداد</SelectItem>
                        <SelectItem value="حضور ولي امر">حضور ولي امر</SelectItem>
                        <SelectItem value="كتاب">كتاب</SelectItem>
                        <SelectItem value="مذكرة">مذكرة</SelectItem>
                        <SelectItem value="أخرى">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <FormLabel>التسجيل</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر التسجيل" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {enrollments.map((enrollment) => (
                          <SelectItem
                            key={enrollment.enrollmentId}
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
                <h4 className="text-sm font-medium">المدفوع</h4>
                <Badge className="mb-2" variant="outline">
                  {enrollment?.paidAmount}
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
                  <FormLabel>المبلغ المدفوع</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="w-32"
                      value={amount}
                      onChange={(e) => {
                        const value = Number(e.target.value)
                        if (receiptType === 'student_payment' && enrollmentId) {
                          if (value > (enrollment?.remainingBalance ?? 0)) {
                            toast.error('المبلغ أكبر من الرصيد المتبقي')
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
                <h4 className="text-sm font-medium">المتبقي</h4>
                <Badge className="mb-2" variant="outline">
                  {enrollment?.remainingBalance ? enrollment?.remainingBalance - amount : 0}
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
          {!showActions ? (
            <Button type="submit" className="justify-end self-end" disabled={isLoading}>
              <span className="flex items-center gap-2">
                <SaveIcon className="h-4 w-4" />
                حفظ
              </span>
            </Button>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={handlePrint}>
                طباعة
              </Button>
              <Button type="button" variant="outline" onClick={handleWhatsApp}>
                إرسال عبر WhatsApp
              </Button>
              <Button 
                type="button" 
                variant="default" 
                onClick={() => {
                  setShowActions(false)
                  setLastCreatedReceipt(null)
                }}
              >
                إيصال جديد
              </Button>
            </>
          )}
        </motion.div>
      </form>
      
      {/* عرض بيانات الإيصال الجديد */}
      {lastCreatedReceipt && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">بيانات الإيصال المُنشأ</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">رقم الإيصال:</span>
              <p className="text-gray-700">{lastCreatedReceipt.receiptNumber}</p>
            </div>
            <div>
              <span className="font-medium">اسم الطالب:</span>
              <p className="text-gray-700">{lastCreatedReceipt.studentName}</p>
            </div>
            <div>
              <span className="font-medium">رقم الهاتف:</span>
              <p className="text-gray-700">{lastCreatedReceipt.studentPhone || 'غير متوفر'}</p>
            </div>
            <div>
              <span className="font-medium">المبلغ:</span>
              <p className="text-gray-700">{lastCreatedReceipt.amount} ريال</p>
            </div>
            <div>
              <span className="font-medium">نوع الإيصال:</span>
              <p className="text-gray-700">
                {lastCreatedReceipt.receiptType === 'student_payment' ? 'دفع طالب' : 'رسوم خدمة'}
              </p>
            </div>
            <div>
              <span className="font-medium">الموظف:</span>
              <p className="text-gray-700">{lastCreatedReceipt.employeeCode}</p>
            </div>
            {lastCreatedReceipt.serviceType && (
              <div>
                <span className="font-medium">نوع الخدمة:</span>
                <p className="text-gray-700">{lastCreatedReceipt.serviceType}</p>
              </div>
            )}
          </div>
          
          {/* أزرار الإجراءات */}
          <div className="flex gap-3 mt-6">
            <Button type="button" variant="outline" onClick={handlePrint}>
              طباعة الإيصال
            </Button>
            {lastCreatedReceipt.studentPhone && (
              <>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleWhatsApp}
                  className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                >
                  إرسال عبر WhatsApp
                </Button>
                <Button 
                  type="button" 
                  variant="default" 
                  onClick={() => {
                    setShowActions(false)
                    setLastCreatedReceipt(null)
                  }}
                >
                  إيصال جديد
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </Form>
  )
}
