'use server'

import { apis } from '@/lib/const/api.enum'
import { INewReceipt } from './(components)/new-receipt.interface'
import { NewReceiptSchema } from '@/lib/schema/new-receipt.schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'

const url = apis.receipts

export async function getNewReceipts() {
  // لا يوجد endpoint في API لجلب جميع الإيصالات
  // بناءً على swagger.json، FinancialOperations لا يحتوي على pagination endpoint
  console.warn('No API endpoint available for fetching all receipts')
  return { 
    data: [], 
    total: 0, 
    page: 1, 
    limit: 10,
    success: false 
  } as IResponse<INewReceipt[]>
}

// جلب أرصدة طالب محدد
export async function getStudentBalances(studentId: number) {
  try {
    const res = await axiosInstance.get(`FinancialOperations/student/balances/${studentId}`)
    return res.data
  } catch (error) {
    console.error('Error fetching student balances:', error)
    return null
  }
}

// جلب رسوم خدمة لطالب محدد
export async function getStudentServiceCharges(studentId: number) {
  try {
    const res = await axiosInstance.get(`FinancialOperations/student/service-charges/${studentId}`)
    return res.data
  } catch (error) {
    console.error('Error fetching student service charges:', error)
    return []
  }
}

// جلب جميع البيانات المالية للطالب (أرصدة + رسوم خدمة)
export async function getStudentFinancialData(studentId: number) {
  try {
    const [balances, serviceCharges] = await Promise.all([
      getStudentBalances(studentId),
      getStudentServiceCharges(studentId)
    ])
    
    return {
      balances,
      serviceCharges,
      studentId
    }
  } catch (error) {
    console.error('Error fetching student financial data:', error)
    return {
      balances: null,
      serviceCharges: [],
      studentId
    }
  }
}

export async function getNewReceipt(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as INewReceipt
}

export async function createNewReceipt(data: NewReceiptSchema) {
  if (data.receiptType === 'student_payment') {
    const payload = {
      enrollmentId: data.enrollmentId,
      amount: data.amount,
      description: data.description,
      receiptNumber: data.receiptNumber,
    }
    const res = await axiosInstance.post(apis.studentPayment, payload)
    return res.data
  } else if (data.receiptType === 'service_charge') {
    const payload = {
      studentId: data.studentId,
      serviceType: data.serviceType,
      amount: data.amount,
      description: data.description,
      receiptNumber: data.receiptNumber,
    }
    const res = await axiosInstance.post(apis.serviceCharge, payload)
    return res.data
  }
}

export async function updateNewReceipt(id: number, data: NewReceiptSchema) {
  const res = await axiosInstance.put(`${url}/${id}`, data)
  return res.data as INewReceipt
}

export async function deleteNewReceipt(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreNewReceipt(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as INewReceipt
}
