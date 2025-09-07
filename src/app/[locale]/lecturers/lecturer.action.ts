'use server'

import { apis } from '@/lib/const/api.enum'
import { ILecturer } from './(components)'
import { LecturerSchema } from '@/lib/schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'
import { AxiosError } from 'axios'
const url = `${apis.lecturers}`

export async function getLecturers() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<ILecturer[]>
}

export async function getLecturer(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as ILecturer
}

export async function createLecturer(data: LecturerSchema) {
  const res = await axiosInstance.post(url, data)
  return res.data as ILecturer
}

export async function updateLecturer(id: number, data: LecturerSchema) {
  try {
    const { email, ...rest } = data
    const res = await axiosInstance.put(`${url}/${id}`, rest)
    return res.data as ILecturer
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data)
    }
    throw new Error('Failed to update lecturer')
  }
}

export async function deleteLecturer(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreLecturer(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as ILecturer
}
