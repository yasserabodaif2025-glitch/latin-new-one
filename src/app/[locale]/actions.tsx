'use server'
import { axiosInstance } from '@/lib/axiosInstance'
import { apis } from '@/lib/const/api.enum'

export const getSalaryTypes = async () => {
  const res = await axiosInstance.get(apis.salaryTypes)
  return res.data
}
