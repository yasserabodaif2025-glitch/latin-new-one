'use server'

import { apis } from '@/lib/const/api.enum'
import { INewReceipt } from './(components)/new-receipt.interface'
import { NewReceiptSchema } from '@/lib/schema/new-receipt.schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'
import { getReceipts } from '@/lib/api/financial.service'

const url = apis.receipts

export async function getNewReceipts(params: { page?: number, pageSize?: number, fromDate?: string, toDate?: string, employeeId?: number } = {}) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const defaultParams = {
      page: 1,
      pageSize: 10,
      fromDate: today,
      toDate: today,
      ...params
    };

    const response = await getReceipts(defaultParams);
    
    // Map to INewReceipt if necessary
    const mappedItems = response.items.map(item => ({
      id: item.id,
      studentId: item.studentId,
      studentName: item.studentName,
      amount: item.amount,
      date: item.date,
      receiptNumber: item.receiptNumber,
      description: item.description,
      type: item.type,
      receiptType: item.receiptType,
      createdBy: item.createdByName,
      createdAt: item.createdAt,
      enrollment: item.enrollment,
      serviceType: item.serviceType,
    }));

    return {
      data: mappedItems,
      total: response.total,
      page: response.page,
      limit: response.pageSize,
      success: true
    } as IResponse<INewReceipt[]>;
  } catch (error) {
    console.error('Error fetching receipts:', error);
    return { 
      data: [], 
      total: 0, 
      page: 1, 
      limit: 10,
      success: false 
    } as IResponse<INewReceipt[]>;
  }
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
