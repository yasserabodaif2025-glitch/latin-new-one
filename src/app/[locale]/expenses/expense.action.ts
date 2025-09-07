'use server'

import { apis } from '@/lib/const/api.enum'
import { IExpense } from './(components)/expense.interface'
import { ExpenseSchemaType } from '@/lib/schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'

const url = apis.expenses

export async function getExpenses() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<IExpense[]>
}

export async function getExpense(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as IExpense
}

export async function createExpense(data: ExpenseSchemaType) {
  const res = await axiosInstance.post(url, data)
  return res.data
}

export async function updateExpense(id: number, data: ExpenseSchemaType) {
  const res = await axiosInstance.put(`${url}/${id}`, data)
  return res.data as IExpense
}

export async function deleteExpense(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreExpense(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as IExpense
}

export async function createMyExpense(data: { amount: number; description: string; category?: string }) {
  const res = await axiosInstance.post(`${url}/my-expense`, data)
  return res.data
}
