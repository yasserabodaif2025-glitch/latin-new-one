import { axiosInstance } from '../axiosInstance'
import { apis } from '../const/api.enum'

export interface StudentEnrollment {
  enrollmentId: number
  groupName: string
  courseName: string
  levelName: string
  totalFee: number
  paidAmount: number
  remainingBalance: number
  discount: number
}

export interface StudentWithBalances {
  studentId: number
  studentName: string
  studentPhone: string
  enrollments: StudentEnrollment[]
  totalOutstanding: number
}

export interface StudentPayment {
  id: number
  amount: number
  date: string
  receiptNumber: string
  description: string
}

export interface CollectionAlert {
  totalStudentsWithBalance: number
  totalOutstandingAmount: number
  totalEnrollmentsWithBalance: number
  studentsWithBalances: StudentWithBalances[]
}

export const collectionNotificationsService = {
  // Get all students with outstanding balances
  async getCollectionAlerts(): Promise<CollectionAlert> {
    try {
      console.log('🔄 بدء جلب تنبيهات التحصيل...')

      // استخدم مسار API الداخلي لضمان إضافة التوكن بشكل صحيح من السيرفر
      const res = await fetch('/api/collection-alerts', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // في المتصفح سيتم إرسال الكوكيز تلقائياً لنفس الأصل
        cache: 'no-store',
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`فشل جلب تنبيهات التحصيل: ${res.status} ${text}`)
      }

      const data: any = await res.json()

      const result: CollectionAlert = {
        totalStudentsWithBalance: data?.totalStudentsWithBalance || 0,
        totalOutstandingAmount: data?.totalOutstandingAmount || 0,
        totalEnrollmentsWithBalance: data?.totalEnrollmentsWithBalance || 0,
        studentsWithBalances: (data?.studentsWithBalances || []).map((student: any) => ({
          studentId: student.studentId,
          studentName: student.studentName || 'غير محدد',
          studentPhone: student.studentPhone || 'غير محدد',
          enrollments: (student.enrollments || []).map((enrollment: any) => ({
            enrollmentId: enrollment.enrollmentId,
            groupName: enrollment.groupName || 'غير محدد',
            courseName: enrollment.courseName || 'غير محدد',
            levelName: enrollment.levelName || 'غير محدد',
            totalFee: enrollment.totalFee || 0,
            paidAmount: enrollment.paidAmount || 0,
            remainingBalance: enrollment.remainingBalance || 0,
            discount: enrollment.discount || 0,
          })),
          totalOutstanding: student.totalOutstanding || 0,
        })),
      }

      console.log('✅ تم جلب تنبيهات التحصيل بنجاح:', {
        totalStudents: result.totalStudentsWithBalance,
        totalAmount: result.totalOutstandingAmount,
      })

      return result
    } catch (error: any) {
      console.error('خطأ في جلب تنبيهات التحصيل:', error)
      throw new Error(error?.message || 'فشل جلب تنبيهات التحصيل')
    }
  },

  // Get student payments history
  async getStudentPayments(studentId: number): Promise<StudentPayment[]> {
    try {
      console.log(`🔍 جلب مدفوعات الطالب ${studentId}`)
      const response = await axiosInstance.get<StudentPayment[]>(
        `FinancialOperations/student/service-charges/${studentId}`
      )
      return response.data || []
    } catch (error: any) {
      console.error(`خطأ في جلب مدفوعات الطالب ${studentId}:`, error)

      if (error.response) {
        throw new Error(error.response.data?.message || 'فشل جلب مدفوعات الطالب')
      } else if (error.request) {
        throw new Error('لا يوجد اتصال بالخادم. يرجى التحقق من اتصال الشبكة والمحاولة مرة أخرى.')
      } else {
        throw new Error('حدث خطأ أثناء إعداد الطلب. الرجاء المحاولة مرة أخرى.')
      }
    }
  },

  // Get student balance details by ID
  async getStudentBalances(studentId: number): Promise<any[]> {
    try {
      console.log(`🔍 جلب أرصدة الطالب ${studentId}`)
      const response = await axiosInstance.get(`FinancialOperations/student/balances/${studentId}`)
      return response.data || []
    } catch (error: any) {
      console.error(`خطأ في جلب أرصدة الطالب ${studentId}:`, error)

      if (error.response) {
        throw new Error(error.response.data?.message || 'فشل جلب أرصدة الطالب')
      } else if (error.request) {
        throw new Error('لا يوجد اتصال بالخادم. يرجى التحقق من اتصال الشبكة والمحاولة مرة أخرى.')
      } else {
        throw new Error('حدث خطأ أثناء إعداد الطلب. الرجاء المحاولة مرة أخرى.')
      }
    }
  },

  // Get collection summary statistics
  async getCollectionSummary(): Promise<{
    totalStudents: number
    studentsWithBalance: number
    totalOutstanding: number
    averageOutstanding: number
  }> {
    try {
      const alerts = await this.getCollectionAlerts()

      const studentsRes = await axiosInstance.get(
        `${apis.students}/${apis.pagination}?Page=1&Limit=1000`
      )
      const totalStudents = studentsRes.data?.total || 0

      const averageOutstanding =
        alerts.totalStudentsWithBalance > 0
          ? alerts.totalOutstandingAmount / alerts.totalStudentsWithBalance
          : 0

      return {
        totalStudents,
        studentsWithBalance: alerts.totalStudentsWithBalance,
        totalOutstanding: alerts.totalOutstandingAmount,
        averageOutstanding,
      }
    } catch (error: any) {
      console.error('خطأ في جلب ملخص التحصيل:', error)
      throw new Error('فشل جلب ملخص التحصيل')
    }
  },
}
