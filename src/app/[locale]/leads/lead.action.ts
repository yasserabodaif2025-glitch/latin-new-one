'use server'

import { apis } from '@/lib/const/api.enum'
import { ILead } from './(components)'
import { LeadSchema } from '@/lib/schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'

const url = `${apis.leads}`

export async function getLeads() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<ILead[]>
}

export async function getLead(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as ILead
}

export async function createLead(data: LeadSchema) {
  const res = await axiosInstance.post(url, data)
  return res.data as ILead
}

export async function updateLead(id: number, data: LeadSchema) {
  const res = await axiosInstance.put(`${url}/${id}`, data)
  return res.data as ILead
}

export async function deleteLead(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreLead(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as ILead
}
