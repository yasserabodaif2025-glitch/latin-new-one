'use server'

import { apis } from '@/lib/const/api.enum'
import { ICategory } from './(components)'
import { CategorySchema } from '@/lib/schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'

const url = `${apis.categories}`

export async function getCategories() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<ICategory[]>
}

export async function getCategory(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as ICategory
}

export async function createCategory(data: CategorySchema) {
  const res = await axiosInstance.post(url, data)
  return res.data as ICategory
}

export async function updateCategory(id: number, data: CategorySchema) {
  const res = await axiosInstance.put(`${url}/${id}`, data)
  return res.data as ICategory
}

export async function deleteCategory(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreCategory(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as ICategory
}
