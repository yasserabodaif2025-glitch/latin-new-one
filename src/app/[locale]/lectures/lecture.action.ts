'use server'

import { apis } from '@/lib/const/api.enum'
import { ILecture, TodaySessions } from './(components)'
import { LectureSchema } from '@/lib/schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'
import { AxiosError } from 'axios'

const url = `${apis.lectures}`

export async function getLectures() {
  try {
    // Get token for debugging
    const { getToken } = await import('@/app/[locale]/auth/token.action')
    const token = await getToken()

    if (!token) {
      throw new Error('لم يتم العثور على رمز الوصول. الرجاء تسجيل الدخول.')
    }

    const requestURL = `${url}/${apis.pagination}`
    console.log('[Lectures] Making request to:', requestURL)

    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }

    console.log('[Lectures] Request headers:', headers)
    console.log('[Lectures] Token preview:', token.substring(0, 20) + '...')

    // Use axiosInstance without manual headers - let interceptors handle auth
    const res = await axiosInstance.get(requestURL)

    console.log('📊 المحاضرات المجلوبة من الخادم:', {
      status: res.status,
      dataLength: res.data?.data?.length || 0,
      totalCount: res.data?.totalCount || 0,
      sampleLectures: res.data?.data?.slice(0, 3).map((lecture: any) => ({
        id: lecture.id,
        startTime: lecture.startTime,
        groupName: lecture.group?.name,
        groupStartDate: lecture.group?.startDate,
        groupEndDate: lecture.group?.endDate,
        instructorName: lecture.instructor?.name
      })) || []
    })

    // فحص تواريخ المحاضرات مقارنة بتواريخ المجموعة
    if (res.data?.data?.length > 0) {
      const lecturesWithGroups = res.data.data.filter((lecture: any) => lecture.group)
      console.log('🔍 مقارنة تواريخ المحاضرات مع المجموعات:', 
        lecturesWithGroups.slice(0, 5).map((lecture: any) => ({
          lectureId: lecture.id,
          lectureStartTime: lecture.startTime,
          groupStartDate: lecture.group.startDate,
          groupEndDate: lecture.group.endDate,
          isLectureAfterGroupStart: new Date(lecture.startTime) >= new Date(lecture.group.startDate),
          isLectureBeforeGroupEnd: new Date(lecture.startTime) <= new Date(lecture.group.endDate),
          daysDifference: Math.floor((new Date(lecture.startTime).getTime() - new Date(lecture.group.startDate).getTime()) / (1000 * 60 * 60 * 24))
        }))
      )
    }

    return res.data as IResponse<ILecture[]>
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Lectures API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      })

      if (error.response?.status === 401) {
        throw new Error('Unauthorized - Please login again')
      }
      if (error.response?.status === 403) {
        throw new Error('Forbidden - Access denied')
      }
      if (error.response?.status === 404) {
        throw new Error('Lectures not found')
      }
    }
    throw error
  }
}

export async function getLecture(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as ILecture
}

export async function createLecture(data: LectureSchema) {
  try {
    const res = await axiosInstance.post(url, data)
    return res.data as ILecture
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data)
    }
  }
}

export async function updateLecture(id: number, data: LectureSchema) {
  try {
    const res = await axiosInstance.put(`${url}/${id}`, data)
    return res.data as ILecture
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data)
      throw new Error(error.response?.data.message)
    }
  }
}

export async function deleteLecture(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreLecture(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as ILecture
}

export const getLectureCalender = async () => {
  const res = await axiosInstance.get(`${apis.todaySessions}?branchId=1`)

  return res.data as TodaySessions[]
}
