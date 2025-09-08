import { axiosInstance } from '@/lib/axiosInstance'
import { z } from 'zod'

// Define Safe Schema
export const safeSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  employeeId: z.number().min(1, 'Employee is required'),
  description: z.string().optional(),
})

export type SafeSchemaType = z.infer<typeof safeSchema>

// Get all safes
export async function getSafes(params = {}) {
  const res = await axiosInstance.get('FinancialOperations/safes', { params })
  return res.data
}

// Get single safe
export async function getSafe(id: number) {
  const res = await axiosInstance.get(`FinancialOperations/safes/${id}`)
  return res.data
}

// Create safe
export async function createSafe(data: SafeSchemaType) {
  const res = await axiosInstance.post('FinancialOperations/safes', data)
  return res.data
}

// Update safe
export async function updateSafe(id: number, data: SafeSchemaType) {
  const res = await axiosInstance.put(`FinancialOperations/safes/${id}`, data)
  return res.data
}

// Delete safe
export async function deleteSafe(id: number) {
  const res = await axiosInstance.delete(`FinancialOperations/safes/${id}`)
  return res.data
}
