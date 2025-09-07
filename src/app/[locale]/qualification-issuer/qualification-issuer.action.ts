'use server'

import { apis } from '@/lib/const/api.enum'
import { IQualificationIssuer } from './(components)/qualification-issuer.interface'
import { QualificationIssuerSchema } from '@/lib/schema/qualification-issuer.schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'

const url = `${apis.qualificationIssuer}`

export async function getQualificationIssuers() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<IQualificationIssuer[]>
}

export async function getQualificationIssuer(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as IQualificationIssuer
}

export async function createQualificationIssuer(data: QualificationIssuerSchema) {
  const res = await axiosInstance.post(url, data)
  return res.data as IQualificationIssuer
}

export async function updateQualificationIssuer(id: number, data: QualificationIssuerSchema) {
  const res = await axiosInstance.put(`${url}/${id}`, data)
  return res.data as IQualificationIssuer
}

export async function deleteQualificationIssuer(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreQualificationIssuer(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as IQualificationIssuer
}
