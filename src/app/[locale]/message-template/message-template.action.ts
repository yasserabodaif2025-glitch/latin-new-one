'use server'

import { apis } from '@/lib/const/api.enum'
import { IMessageTemplate } from './(components)'
import { MessageTemplateSchema } from '@/lib/schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'
import { IFlowStep } from './(components)/flow-step.interface'

const url = `${apis.messageTemplates}`

export async function getMessageTemplates() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<IMessageTemplate[]>
}

export async function getMessageTemplate(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as IMessageTemplate
}

export async function createMessageTemplate(data: MessageTemplateSchema) {
  const res = await axiosInstance.post(url, data)
  return res.data as IMessageTemplate
}

export async function updateMessageTemplate(id: number, data: MessageTemplateSchema) {
  const res = await axiosInstance.put(`${url}/${id}`, data)
  return res.data as IMessageTemplate
}

export async function deleteMessageTemplate(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreMessageTemplate(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as IMessageTemplate
}

export async function getFlowSteps() {
  const res = await axiosInstance.get(apis.flowSteps)
  return res.data as IFlowStep[]
}
