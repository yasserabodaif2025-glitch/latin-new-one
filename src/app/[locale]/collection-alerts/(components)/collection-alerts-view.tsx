'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, User, Users, CreditCard, Receipt } from 'lucide-react'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { 
  collectionNotificationsService,
  type StudentPayment,
  type CollectionAlert
} from '@/lib/api/collection-notifications.service'

export default function CollectionAlertsView() {
  const [collectionAlert, setCollectionAlert] = useState<CollectionAlert | null>(null)
  const [studentPayments, setStudentPayments] = useState<{[key: number]: StudentPayment[]}>({})
  const [isLoading, setIsLoading] = useState(true)

  const fetchCollectionAlerts = async () => {
    try {
      setIsLoading(true)
      const alertData = await collectionNotificationsService.getCollectionAlerts()
      setCollectionAlert(alertData)
    } catch (error) {
      console.error('Error fetching collection alerts:', error)
      
      if (error instanceof Error) {
        if (error.message.includes('EHOSTUNREACH') || error.message.includes('503')) {
          toast.error('خطأ في الاتصال', {
            description: 'لا يمكن الوصول إلى الخادم. تأكد من تشغيل الخادم أو اتصال الإنترنت.',
          })
        } else if (error.message.includes('404')) {
          toast.error('خطأ في API', {
            description: 'نقطة النهاية غير موجودة. تحقق من إعدادات API.',
          })
        } else {
          toast.error('خطأ', {
            description: `فشل في جلب تنبيهات التحصيل: ${error.message}`,
          })
        }
      } else {
        toast.error('خطأ', {
          description: 'فشل في جلب تنبيهات التحصيل.',
        })
      }
      
      setCollectionAlert({
        totalStudentsWithBalance: 0,
        totalOutstandingAmount: 0,
        totalEnrollmentsWithBalance: 0,
        studentsWithBalances: []
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStudentPayments = async (studentId: number) => {
    try {
      const payments = await collectionNotificationsService.getStudentPayments(studentId)
      setStudentPayments(prev => ({
        ...prev,
        [studentId]: payments
      }))
    } catch (error) {
      console.error(`Error fetching payments for student ${studentId}:`, error)
    }
  }


  useEffect(() => {
    fetchCollectionAlerts()
  }, [])

  const studentsWithBalance = collectionAlert?.studentsWithBalances || []
  const totalOutstandingAmount = collectionAlert?.totalOutstandingAmount || 0
  const totalEnrollmentsWithBalance = collectionAlert?.totalEnrollmentsWithBalance || 0

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">جاري تحميل تنبيهات التحصيل...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عدد الطلاب المدينين</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {studentsWithBalance.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المبالغ المتبقية</CardTitle>
            <CreditCard className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalOutstandingAmount.toLocaleString('ar-EG')} جنيه
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عدد التسجيلات المدينة</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalEnrollmentsWithBalance}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* جدول الطلاب المدينين */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            تنبيهات التحصيل - الطلاب المدينين
          </CardTitle>
        </CardHeader>
        <CardContent>
          {studentsWithBalance.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا يوجد طلاب لديهم مبالغ متبقية
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-2">
              {studentsWithBalance.map((student) => (
                <AccordionItem 
                  key={student.studentId}
                  value={student.studentId.toString()}
                  className="border rounded-lg"
                >
                  <AccordionTrigger 
                    className="flex items-center justify-between p-4 hover:bg-gray-50 [&[data-state=open]>svg]:rotate-180"
                    onClick={() => {
                      if (!studentPayments[student.studentId]) {
                        fetchStudentPayments(student.studentId)
                      }
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <User className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">{student.studentName}</div>
                        <div className="text-sm text-gray-500">{student.studentPhone}</div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {student.enrollments.map((enrollment) => (
                          <Badge key={enrollment.enrollmentId} variant="outline" className="text-xs">
                            {enrollment.groupName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm text-gray-500">إجمالي المتبقي</div>
                      <div className="font-bold text-red-600">
                        {student.totalOutstanding.toLocaleString('ar-EG')} جنيه
                      </div>
                      <div className="text-xs text-gray-500">
                        {student.enrollments.length} تسجيل
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent>
                    <div className="px-4 pb-4">
                      <div className="space-y-4">
                        {/* عرض كل تسجيل منفصل */}
                        {student.enrollments.map((enrollment) => (
                          <div key={enrollment.enrollmentId} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-lg">
                                {enrollment.groupName} - {enrollment.courseName}
                              </h4>
                              <Badge variant={enrollment.remainingBalance > 0 ? "destructive" : "default"}>
                                {enrollment.levelName}
                              </Badge>
                            </div>
                            
                            {/* تفاصيل التسجيل المالية */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="font-medium">إجمالي الرسوم:</span>
                                <div className="text-blue-600">{enrollment.totalFee.toLocaleString('ar-EG')} جنيه</div>
                              </div>
                              <div>
                                <span className="font-medium">المدفوع:</span>
                                <div className="text-green-600">{enrollment.paidAmount.toLocaleString('ar-EG')} جنيه</div>
                              </div>
                              <div>
                                <span className="font-medium">الخصم:</span>
                                <div className="text-orange-600">{enrollment.discount.toLocaleString('ar-EG')} جنيه</div>
                              </div>
                              <div>
                                <span className="font-medium">المتبقي:</span>
                                <div className="text-red-600 font-bold">{enrollment.remainingBalance.toLocaleString('ar-EG')} جنيه</div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* إيصالات الدفع للطالب */}
                        {studentPayments[student.studentId] && (
                          <div className="bg-white p-4 rounded-lg border">
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              <Receipt className="h-4 w-4" />
                              إيصالات الدفع
                            </h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>رقم الإيصال</TableHead>
                                  <TableHead>المبلغ</TableHead>
                                  <TableHead>التاريخ</TableHead>
                                  <TableHead>الوصف</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {studentPayments[student.studentId].map((payment) => (
                                  <TableRow key={payment.id}>
                                    <TableCell>{payment.receiptNumber}</TableCell>
                                    <TableCell>{payment.amount.toLocaleString('ar-EG')} جنيه</TableCell>
                                    <TableCell>{new Date(payment.date).toLocaleDateString('ar-SA')}</TableCell>
                                    <TableCell>{payment.description}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
