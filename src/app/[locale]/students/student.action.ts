'use server'

import { apis } from '@/lib/const/api.enum'
import { IStudent } from './(components)'
import { StudentSchema } from '@/lib/schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'
import { AxiosError } from 'axios'
import { IStudentBalance } from '../receipts/(components)/receipt.interface'

const url = `${apis.students}`

export async function getStudents() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<IStudent[]>
}

export async function getStudent(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as IStudent
}

export async function createStudent(data: StudentSchema) {
  const res = await axiosInstance.post(url, data)
  return res.data as IStudent
}

export async function updateStudent(id: number, data: StudentSchema) {
  const res = await axiosInstance.put(`${url}/${id}`, data)
  return res.data as IStudent
}

export async function deleteStudent(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreStudent(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as IStudent
}

export async function getStudentBalance(studentId: number) {
  try {
    const res = await axiosInstance.get(`FinancialOperations/student/balances/${studentId}`)
    return res.data as IStudentBalance[]
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.config?.url, error.config?.baseURL)
      console.log(error.response?.data)
      return Promise.reject(error.response?.data)
    }
    console.log(error)
    return Promise.reject(error)
  }
}

export type SessionsPaginationParams = {
  Page?: number
  Limit?: number
  SortField?: string
  IsDesc?: boolean
  FreeText?: string
  OnlyDeleted?: boolean
}

export async function getSessionsPage(params: SessionsPaginationParams = {}) {
  try {
    const res = await axiosInstance.get('Sessions/pagination', { params })
    return res.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.config?.url, error.config?.baseURL)
      console.log(error.response?.data)
      return Promise.reject(error.response?.data)
    }
    console.log(error)
    return Promise.reject(error)
  }
}

export async function getStudentPaymentHistory(studentId: number) {
  try {
    const res = await axiosInstance.get(`Financial/student-payment/history/${studentId}`)
    return res.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.config?.url, error.config?.baseURL)
      console.log(error.response?.data)
      return Promise.reject(error.response?.data)
    }
    console.log(error)
    return Promise.reject(error)
  }
}
