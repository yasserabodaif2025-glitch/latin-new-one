'use server'

import { axiosInstance } from '@/lib/axiosInstance'

export interface InventoryItem {
  id: number
  name: string
  category: string
  quantity: number
  unitPrice: number
  totalValue: number
  location: string
  lastUpdated: string
  minStock: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
}

export async function getInventoryItems(): Promise<{ data: InventoryItem[] }> {
  try {
    const response = await axiosInstance.get('/inventory')
    return { data: response.data || [] }
  } catch (error) {
    console.error('خطأ في جلب بيانات الجرد:', error)
    return { data: [] }
  }
}

export async function createInventoryItem(data: Omit<InventoryItem, 'id' | 'totalValue' | 'lastUpdated' | 'status'>) {
  try {
    const response = await axiosInstance.post('/inventory', {
      ...data,
      totalValue: data.quantity * data.unitPrice,
      lastUpdated: new Date().toISOString(),
      status: data.quantity <= data.minStock ? 'low_stock' : 'in_stock'
    })
    return response.data
  } catch (error) {
    console.error('خطأ في إضافة عنصر الجرد:', error)
    throw error
  }
}

export async function updateInventoryItem(id: number, data: Partial<InventoryItem>) {
  try {
    const response = await axiosInstance.put(`/inventory/${id}`, {
      ...data,
      lastUpdated: new Date().toISOString()
    })
    return response.data
  } catch (error) {
    console.error('خطأ في تحديث عنصر الجرد:', error)
    throw error
  }
}

export async function deleteInventoryItem(id: number) {
  try {
    await axiosInstance.delete(`/inventory/${id}`)
  } catch (error) {
    console.error('خطأ في حذف عنصر الجرد:', error)
    throw error
  }
}