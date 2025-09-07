'use server'

import { apis } from '@/lib/const/api.enum'
import { IMessage } from './(components)'
import { MessageSchema } from '@/lib/schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'
import axios from 'axios'

const url = `${apis.messages}`

export async function getMessages() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<IMessage[]>
}

export async function getMessage(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as IMessage
}

export async function createMessage(data: MessageSchema) {
  const res = await axiosInstance.post(url, data)
  return res.data as IMessage
}

export async function updateMessage(id: number, data: MessageSchema) {
  const res = await axiosInstance.put(`${url}/${id}`, data)
  return res.data as IMessage
}

export async function deleteMessage(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreMessage(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as IMessage
}

export async function getQrCode() {
  const res = await axios.get(`http://198.7.125.213:4000/qr`)
  return res.data as { qr: string; status: string }
}

export async function sendMessage(data: { number: string; message: string }) {
  const res = await axios.post(`http://198.7.125.213:4000/send-message`, data)
  return res.data as IMessage
}
