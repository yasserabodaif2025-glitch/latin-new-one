'use server'

import { apis } from '@/lib/const/api.enum'
import { ICourse } from './(components)'
import { CourseSchema } from '@/lib/schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'

const url = `${apis.courses}`

export async function getCourses() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<ICourse[]>
}

export async function getCourse(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as ICourse
}

export async function createCourse(data: CourseSchema) {
  const res = await axiosInstance.post(url, data)
  return res.data as ICourse
}

export async function updateCourse(id: number, data: CourseSchema) {
  const res = await axiosInstance.put(`${url}/${id}`, data)
  return res.data as ICourse
}

export async function deleteCourse(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreCourse(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as ICourse
}
