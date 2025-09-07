'use server'

import { apis } from '@/lib/const/api.enum'
import { ILab, ILabType } from './(components)'
import { LabSchema } from '@/lib/schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'

const url = `${apis.labs}`

export async function getLabs() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<ILab[]>
}

export async function getLab(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as ILab
}

export async function createLab(data: LabSchema) {
  const res = await axiosInstance.post(url, data)
  return res.data as ILab
}

export async function updateLab(id: number, data: LabSchema) {
  const res = await axiosInstance.put(`${url}/${id}`, data)
  return res.data as ILab
}

export async function deleteLab(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreLab(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as ILab
}

export async function getLabTypes() {
  const res = await axiosInstance.get(apis.roomType)
  return res.data as ILabType[]
}
