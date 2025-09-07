'use server'

import { apis } from '@/lib/const/api.enum'
import { ICourseGroup, ICourseGroupStatus } from '../course-groups/(components)/course-group.interface'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'

const url = `${apis.courseGroups}`

export interface IGroupScheduleItem extends ICourseGroup {
  status: ICourseGroupStatus
  branchName: string
  courseName: string
  categoryName: string
}

export async function getActiveGroups(filters?: {
  statusId?: number
  branchId?: number
  categoryId?: number
}) {
  try {
    console.log('🔍 getActiveGroups: بدء طلب المجموعات النشطة من الخادم')
    
    const queryParams = new URLSearchParams()
    
    // Add filters if provided
    if (filters?.statusId) {
      queryParams.append('statusId', filters.statusId.toString())
    }
    if (filters?.branchId) {
      queryParams.append('branchId', filters.branchId.toString())
    }
    if (filters?.categoryId) {
      queryParams.append('categoryId', filters.categoryId.toString())
    }
    
    const queryString = queryParams.toString()
    const endpoint = `${url}/${apis.pagination}${queryString ? `?${queryString}` : ''}`
    
    const res = await axiosInstance.get(endpoint)
    
    console.log('✅ getActiveGroups: نجح الحصول على المجموعات النشطة', {
      count: res.data?.data?.length || 0,
      total: res.data?.total || 0
    })
    
    return res.data as IResponse<IGroupScheduleItem[]>
  } catch (error: any) {
    console.error('❌ getActiveGroups خطأ:', {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      url: error?.config?.url,
      hasAuthHeader: Boolean(error?.config?.headers?.Authorization)
    })
    
    throw error
  }
}

export async function getGroupStatuses() {
  try {
    const res = await axiosInstance.get(`${apis.groupStatus}`)
    return res.data as ICourseGroupStatus[]
  } catch (error) {
    console.error('❌ getGroupStatuses خطأ:', error)
    throw error
  }
}
