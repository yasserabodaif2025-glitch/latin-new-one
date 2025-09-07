'use server'

import { apis } from '@/lib/const/api.enum'
import { IQualificationType } from './(components)/qualification-type.interface'
import { QualificationTypeSchema } from '@/lib/schema/qualification-type.schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'

const url = `${apis.qualificationType}`

export async function getQualificationTypes() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<IQualificationType[]>
}

export async function getQualificationType(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as IQualificationType
}

export async function createQualificationType(data: QualificationTypeSchema) {
  const res = await axiosInstance.post(url, data)
  return res.data as IQualificationType
}

export async function updateQualificationType(id: number, data: QualificationTypeSchema) {
  const res = await axiosInstance.put(`${url}/${id}`, data)
  return res.data as IQualificationType
}

export async function deleteQualificationType(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreQualificationType(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as IQualificationType
}
