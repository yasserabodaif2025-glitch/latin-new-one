'use server'

import { axiosInstance } from '@/lib/axiosInstance'
import { z } from 'zod'
import { ReceiptSchema } from '@/lib/schema'

const API_BASE_URL = '/api/FinancialOperations'

/**
 * الحصول على قائمة الإيصالات
 * يجمع البيانات من نقاط النهاية المالية المتاحة
 */
export async function getReceipts() {
  try {
    // جلب مدفوعات الطلاب
    const [paymentsResponse, expensesResponse] = await Promise.all([
      axiosInstance.get(`${API_BASE_URL}/student/payments`, {
        headers: { 'Content-Type': 'application/json' },
        params: { _: new Date().getTime() }
      }).catch(() => ({ data: { data: [] } })),
      
      // جلب المصروفات
      axiosInstance.get(`${API_BASE_URL}/my-expense`, {
        headers: { 'Content-Type': 'application/json' },
        params: { _: new Date().getTime() }
      }).catch(() => ({ data: { data: [] } }))
    ]);

    // دمج النتائج
    const payments = paymentsResponse.data?.data || [];
    const expenses = expensesResponse.data?.data || [];

    // تحويل البيانات إلى تنسيق موحد
    const formattedPayments = payments.map((payment: any) => ({
      id: payment.id,
      type: 'payment',
      amount: payment.amount,
      date: payment.paymentDate,
      studentId: payment.studentId,
      studentName: payment.studentName,
      receiptNumber: payment.receiptNumber
    }));

    const formattedExpenses = expenses.map((expense: any) => ({
      id: expense.id,
      type: 'expense',
      amount: -expense.amount, // سالب لأنها مصروف
      date: expense.date,
      description: expense.description,
      expenseType: expense.expenseType,
      receiptNumber: expense.receiptNumber
    }));

    // دمج وترتيب حسب التاريخ
    const allTransactions = [...formattedPayments, ...formattedExpenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { data: allTransactions };
  } catch (error: any) {
    console.error('خطأ في جلب الإيصالات:', error);
    throw new Error(error.response?.data?.message || 'فشل في جلب الإيصالات');
  }
}

export interface PaymentRequest {
  studentId: number
  amount: number
  paymentMethod: string
  notes?: string
  receiptNumber?: string
}

export interface ServiceChargeRequest {
  studentId: number
  amount: number
  serviceType: string
  description: string
  receiptNumber?: string
}

export interface ExpenseRequest {
  amount: number
  expenseType: string
  description: string
  receiptNumber?: string
}

/**
 * دفع رسوم الطالب
 */
export async function payStudentFees(paymentData: PaymentRequest) {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/student/pay`, paymentData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  } catch (error: any) {
    console.error('خطأ في دفع الرسوم:', error)
    throw new Error(error.response?.data?.message || 'فشل في إتمام عملية الدفع')
  }
}

/**
 * تحصيل رسوم خدمة
 */
export async function chargeForService(chargeData: ServiceChargeRequest) {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/service-charge`, chargeData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  } catch (error: any) {
    console.error('خطأ في تحصيل الرسوم:', error)
    throw new Error(error.response?.data?.message || 'فشل في إتمام عملية التحصيل')
  }
}

/**
 * تسجيل مصروف
 */
export async function recordExpense(expenseData: ExpenseRequest) {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/expense`, expenseData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  } catch (error: any) {
    console.error('خطأ في تسجيل المصروف:', error)
    throw new Error(error.response?.data?.message || 'فشل في تسجيل المصروف')
  }
}

/**
 * الحصول على رصيد الطالب
 */
export async function getStudentBalance(studentId: number) {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/student/balances/${studentId}`)
    return response.data
  } catch (error: any) {
    console.error('خطأ في جلب رصيد الطالب:', error)
    throw new Error(error.response?.data?.message || 'فشل في جلب رصيد الطالب')
  }
}

/**
 * الحصول على رصيد الخزنة الشخصية
 */
export async function getMySafeBalance() {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/my-safe-balance`)
    return response.data
  } catch (error: any) {
    console.error('خطأ في جلب رصيد الخزنة:', error)
    throw new Error(error.response?.data?.message || 'فشل في جلب رصيد الخزنة')
  }
}

/**
 * إغلاق الخزنة الشخصية
 */
export async function closeMySafe() {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/close-my-safe`)
    return response.data
  } catch (error: any) {
    console.error('خطأ في إغلاق الخزنة:', error)
    throw new Error(error.response?.data?.message || 'فشل في إغلاق الخزنة')
  }
}

// Helper function to get current employee ID
async function getCurrentEmployeeId(): Promise<number> {
  try {
    // Try to get employee ID from the current user session
    const response = await axiosInstance.get('/api/auth/me')
    if (response.data?.employeeId) {
      return response.data.employeeId
    }
    
    // Fallback to a default employee ID if not found in session
    console.warn('Employee ID not found in session, using default value')
    return 1 // Default employee ID
  } catch (error) {
    console.error('Error getting employee ID:', error)
    return 1 // Default employee ID in case of error
  }
}

export async function createReceipt(data: ReceiptSchema) {
  console.log('💾 Creating receipt with data:', data)
  
  try {
    // Get the current employee ID
    const employeeId = await getCurrentEmployeeId()
    console.log('👤 Using employee ID:', employeeId)
    
    if (data.receiptType === 'student_payment') {
      const payload = {
        enrollmentId: data.enrollmentId,
        amount: data.amount,
        description: data.description,
        employeeId: employeeId,
        createdBy: employeeId,
      }
      console.log('🎓 Student payment payload:', payload)
      
      const res = await axiosInstance.post('FinancialOperations/student/pay', payload)
      console.log('✅ Student payment response:', res.data)
      return res.data
    } else if (data.receiptType === 'service_charge') {
      const payload = {
        studentId: data.studentId,
        serviceType: data.serviceType,
        amount: data.amount,
        description: data.description,
        employeeId: employeeId,
        createdBy: employeeId,
      }
      console.log('🔧 Service charge payload:', payload)
      
      const res = await axiosInstance.post('FinancialOperations/service-charge', payload)
      console.log('✅ Service charge response:', res.data)
      return res.data
    } else if (data.receiptType === 'expense') {
      const payload = {
        amount: data.amount,
        description: data.description,
        employeeId: employeeId,
        createdBy: employeeId,
      }
      console.log('💰 Expense payload:', payload)
      
      const res = await axiosInstance.post('FinancialOperations/my-expense', payload)
      console.log('✅ Expense response:', res.data)
      return res.data
    }
    
    console.warn('⚠️ Unknown receipt type:', data.receiptType)
    throw new Error(`نوع الإيصال غير معروف: ${data.receiptType}`)
  } catch (error) {
    console.error('❌ Error creating receipt:', error)
    throw new Error(error instanceof Error ? error.message : 'فشل في إنشاء الإيصال')
  }
}
