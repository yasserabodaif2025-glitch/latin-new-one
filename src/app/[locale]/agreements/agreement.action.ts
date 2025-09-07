'use server'

import { apis } from '@/lib/const/api.enum'
import { IAgreement } from './(components)/agreement.interface'
import { AgreementSchema } from '@/lib/schema/agreement.schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'

const url = `${apis.studentSource}`

export async function getAgreements() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<IAgreement[]>
}

export async function getAgreement(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as IAgreement
}

export async function createAgreement(data: AgreementSchema) {
  const res = await axiosInstance.post(url, data)
  return res.data as IAgreement
}

export async function updateAgreement(id: number, data: AgreementSchema) {
  const res = await axiosInstance.put(`${url}/${id}`, data)
  return res.data as IAgreement
}

export async function deleteAgreement(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreAgreement(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as IAgreement
}
