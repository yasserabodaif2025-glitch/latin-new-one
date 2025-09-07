'use server'

import { apis } from '@/lib/const/api.enum'
import { IReceipt } from './(components)/receipt.interface'
import { ReceiptSchema } from '@/lib/schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'

const url = apis.receipts

export async function getReceipts() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<IReceipt[]>
}

export async function getReceipt(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as IReceipt
}

export async function createReceipt(data: ReceiptSchema) {
  if (data.receiptType === 'student_payment') {
    const payload = {
      enrollmentId: data.enrollmentId,
      amount: data.amount,
      description: data.description,
    }
    const res = await axiosInstance.post(apis.studentPayment, payload)
    return res.data
  } else if (data.receiptType === 'service_charge') {
    const payload = {
      studentId: data.studentId,
      serviceType: data.serviceType,
      amount: data.amount,
      description: data.description,
    }
    const res = await axiosInstance.post(apis.serviceCharge, payload)
    return res.data
  }
}

export async function updateReceipt(id: number, data: ReceiptSchema) {
  const res = await axiosInstance.put(`${url}/${id}`, data)
  return res.data as IReceipt
}

export async function deleteReceipt(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreReceipt(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as IReceipt
}

/**
 * إلغاء إيصال باستخدام رقم الإيصال
 */
export async function cancelReceipt(receiptNumber: string) {
  try {
    const response = await axiosInstance.patch(`${url}/${receiptNumber}/cancel`)
    return response.data
  } catch (error: any) {
    console.error('خطأ في إلغاء الإيصال:', error)
    throw new Error(error.response?.data?.message || 'فشل في إلغاء الإيصال')
  }
}
