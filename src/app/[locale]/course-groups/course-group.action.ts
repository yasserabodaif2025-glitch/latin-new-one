'use server'

import { apis } from '@/lib/const/api.enum'
import { ICourseGroup, ICourseGroupDay, ICourseGroupStatus } from './(components)'
import { CourseGroupSchema } from '@/lib/schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'
import { AxiosError } from 'axios'
import { parseTime } from '@/lib/parse-time'

const url = `${apis.courseGroups}`

export async function getCourseGroups() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<ICourseGroup[]>
}

export async function getCourseGroup(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as ICourseGroup
}

export async function createCourseGroup(data: CourseGroupSchema) {
  try {
    console.log('🔧 معالجة بيانات المجموعة قبل الإرسال:', {
      originalStartDate: data.startDate,
      originalEndDate: data.endDate,
      startDateType: typeof data.startDate,
      endDateType: typeof data.endDate
    })

    // تحويل التواريخ لتجنب مشاكل المنطقة الزمنية
    const formatDateForServer = (date: Date) => {
      if (!date) return null
      // استخدام التاريخ المحلي بدون تحويل منطقة زمنية
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    const payload = {
      ...data,
      startDate: formatDateForServer(data.startDate),
      endDate: formatDateForServer(data.endDate),
      startTime: parseTime(data.startTime),
      endTime: parseTime(data.endTime),
    }
    
    console.log('📤 البيانات النهائية المرسلة للخادم:', {
      originalDates: {
        startDate: data.startDate,
        endDate: data.endDate
      },
      formattedDates: {
        startDate: payload.startDate,
        endDate: payload.endDate
      },
      fullPayload: payload
    })
    
    const res = await axiosInstance.post(url, payload)
    return res.data as ICourseGroup
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Course group creation error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config
      })
      
      // Extract meaningful error message
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.response?.data || 
                          error.message || 
                          'فشل في إنشاء المجموعة'
      
      throw new Error(errorMessage)
    }
    console.error('Unexpected error:', error)
    throw new Error('فشل في إنشاء المجموعة')
  }
}

export async function updateCourseGroup(id: number, data: CourseGroupSchema) {
  try {
    console.log('Updating course group with data:', data)
    const payload = {
      ...data,
      startTime: parseTime(data.startTime),
      endTime: parseTime(data.endTime),
    }
    console.log('Sending update payload:', payload)
    
    const res = await axiosInstance.put(`${url}/${id}`, payload)
    return res.data as ICourseGroup
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Course group update error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config
      })
      
      // Extract meaningful error message
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.response?.data || 
                          error.message || 
                          'فشل في تحديث المجموعة'
      
      throw new Error(errorMessage)
    }
    console.error('Unexpected error:', error)
    throw new Error('فشل في تحديث المجموعة')
  }
}

export async function deleteCourseGroup(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreCourseGroup(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as ICourseGroup
}

export async function getCourseGroupStatus() {
  const res = await axiosInstance.get(`${apis.groupStatus}`)
  return res.data as ICourseGroupStatus[]
}

export async function getCourseGroupDays() {
  const res = await axiosInstance.get(`${apis.groupDays}`)
  return res.data as ICourseGroupDay[]
}

export async function registerCampaignLead(data: {
  name: string
  email: string
  phone: string
  address: string
  areaId: number
  birthdate: string
  courseId: number
  branchId: number
}) {
  const res = await axiosInstance.post(`${apis.campaignLeads}`, data)
  return res.data
}

export async function closeGroup(groupId: number) {
  const res = await axiosInstance.post(`${url}/close-group`, { groupId })
  return res.data
}

export async function activateGroup(body: {
  groupId: number
  enrollments: { studentId: number; discount: number }[]
}) {
  const res = await axiosInstance.post(`${url}/activate`, body)

  return res.data
}

export async function deactivateGroup(groupId: number) {
  const res = await axiosInstance.post(`${url}/deactivate/${groupId}`)
  return res.data
}

export async function addExtraSession(groupId: number, sessionData: any) {
  const res = await axiosInstance.post(`${url}/add-extra-session`, { groupId, ...sessionData })
  return res.data
}

export async function enrollGroup(enrollmentId: number, groupId: number) {
  const res = await axiosInstance.post(`${url}/enroll/${enrollmentId}/group/${groupId}`)
  return res.data
}

export async function updateSessionAttendance(sessionId: number, data: any) {
  try {
    const res = await axiosInstance.put(`/api/Sessions/${sessionId}`, data)
    return res.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(error.response?.data)
      throw new Error(error.response?.data)
    }
    throw new Error('Failed to update session attendance')
  }
}
