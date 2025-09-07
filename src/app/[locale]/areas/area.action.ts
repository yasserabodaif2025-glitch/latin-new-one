'use server'

import { apis } from '@/lib/const/api.enum'
import { IArea } from './(components)'
import { AreaSchema } from '@/lib/schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'

const url = `${apis.areas}`

export async function getAreas() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<IArea[]>
}

export async function getArea(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as IArea
}

export async function createArea(data: AreaSchema) {
  const res = await axiosInstance.post(url, data)
  return res.data as IArea
}

export async function updateArea(id: number, data: AreaSchema) {
  const res = await axiosInstance.put(`${url}/${id}`, data)
  return res.data as IArea
}

export async function deleteArea(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreArea(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as IArea
}
