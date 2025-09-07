'use server'

import { apis } from '@/lib/const/api.enum'
import { IQualificationDescription } from './(components)/qualification-description.interface'
import { QualificationDescriptionSchema } from '@/lib/schema/qualification-description.schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'

const url = `${apis.qualificationDescription}`

export async function getQualificationDescriptions() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<IQualificationDescription[]>
}

export async function getQualificationDescription(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as IQualificationDescription
}

export async function createQualificationDescription(data: QualificationDescriptionSchema) {
  const res = await axiosInstance.post(url, data)
  return res.data as IQualificationDescription
}

export async function updateQualificationDescription(
  id: number,
  data: QualificationDescriptionSchema
) {
  const res = await axiosInstance.put(`${url}/${id}`, data)
  return res.data as IQualificationDescription
}

export async function deleteQualificationDescription(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreQualificationDescription(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as IQualificationDescription
}
