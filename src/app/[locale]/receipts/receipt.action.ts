'use server'

import { axiosInstance } from '@/lib/axiosInstance'
import { ReceiptSchema } from '@/lib/schema/receipt.schema'
import { z } from 'zod'

const API_ENDPOINT = 'FinancialOperations'

/**
 * الحصول على قائمة الإيصالات
 */
export async function getReceipts() {
  try {
    const response = await fetch(`${process.env.API_URL}/api/FinancialOperations/receipts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching for dynamic content
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error('خطأ في جلب الإيصالات:', error)
    throw new Error(error.message || 'فشل في جلب الإيصالات')
  }
}

/**
 * إنشاء إيصال جديد
 */
export async function createReceipt(data: z.infer<typeof ReceiptSchema>) {
  try {
    const response = await fetch(`${process.env.API_URL}/api/FinancialOperations/receipts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error: any) {
    console.error('خطأ في إنشاء الإيصال:', error)
    throw new Error(error.message || 'فشل في إنشاء الإيصال')
  }
}

/**
 * إلغاء إيصال
 */
export async function cancelReceipt(receiptNumber: string) {
  try {
    const response = await axiosInstance.patch(`${API_ENDPOINT}/receipts/${receiptNumber}/cancel`)
    return response.data
  } catch (error: any) {
    console.error('خطأ في إلغاء الإيصال:', error)
    throw new Error(error.response?.data?.message || 'فشل في إلغاء الإيصال')
  }
}

/**
 * الحصول على تنبيهات التحصيل
 */
export async function getCollectionAlerts() {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}/collection-alerts`)
    return response.data
  } catch (error: any) {
    console.error('خطأ في جلب تنبيهات التحصيل:', error)
    throw new Error(error.response?.data?.message || 'فشل في جلب تنبيهات التحصيل')
  }
}
