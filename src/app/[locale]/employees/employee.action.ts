'use server'

import { apis } from '@/lib/const/api.enum'
import { IEmployee } from './(components)/employee.interface'
import { employeeSchema } from '@/lib/schema/employee.schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'
import { revalidatePath } from 'next/cache'

const url = `${apis.employees}`

export async function getEmployees() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<IEmployee[]>
}

export async function getEmployee(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as IEmployee
}

export async function createEmployee(data: typeof employeeSchema._type) {
  try {
    // تأكد من وجود كلمة المرور عند إنشاء موظف جديد
    if (!data.password || String(data.password).trim() === '') {
      throw new Error('كلمة المرور مطلوبة عند إنشاء موظف جديد')
    }

    // Build payload with safe conversions. Only set transformed fields when valid.
    const payload: any = { ...data }

    // birthDate: convert only when present and valid
    if (data.birthDate) {
      const d = new Date(data.birthDate)
      if (!isNaN(d.getTime())) {
        payload.birthDate = d.toISOString()
      } else {
        // remove invalid birthDate to avoid runtime errors in API
        delete payload.birthDate
      }
    } else {
      delete payload.birthDate
    }

    // Numeric conversions: only when value is not null/undefined
    if (data.cityId != null) payload.cityId = Number(data.cityId)
    if (data.salaryTypeId != null) payload.salaryTypeId = Number(data.salaryTypeId)
    if (data.salary != null) payload.salary = Number(data.salary)
    if (data.educationalQualificationId != null)
      payload.educationalQualificationId = Number(data.educationalQualificationId)
    if (data.roleId != null) payload.roleId = Number(data.roleId)

    const res = await axiosInstance.post(url, payload)

    // إعادة تحديث الصفحة بعد الإنشاء
    revalidatePath('/[locale]/employees')
    return res.data as IEmployee
  } catch (error: any) {
    // Provide more detailed logging for easier debugging
    console.error('خطأ في إنشاء الموظف:', {
      message: error?.message,
      responseData: error?.response?.data,
      stack: error?.stack,
    })

    const apiMessage = error?.response?.data?.message || error?.response?.data || error?.message
    throw new Error(apiMessage || 'فشل في إنشاء الموظف')
  }
}

export async function updateEmployee(id: number, data: typeof employeeSchema._type) {
  try {
    // نستخرج فقط البيانات التي نريد تحديثها
    const updateData: any = {
      name: data.name,
      phone: data.phone,
      address: data.address,
      nationalId: data.nationalId,
      department: data.department,
      jobTitle: data.jobTitle,
      status: data.status,
    }

    // safe birthDate conversion
    if (data.birthDate) {
      const d = new Date(data.birthDate)
      if (!isNaN(d.getTime())) updateData.birthDate = d.toISOString()
    }

    if (data.cityId != null) updateData.cityId = Number(data.cityId)
    if (data.salary != null) updateData.salary = Number(data.salary)
    if (data.salaryTypeId != null) updateData.salaryTypeId = Number(data.salaryTypeId)
    if (data.educationalQualificationId != null)
      updateData.educationalQualificationId = Number(data.educationalQualificationId)
    if (data.roleId != null) updateData.roleId = Number(data.roleId)

    const res = await axiosInstance.put(`${url}/${id}`, updateData)

    // إعادة تحديث الصفحة بعد التحديث
    revalidatePath('/[locale]/employees')
    return res.data as IEmployee
  } catch (error: any) {
    console.error('خطأ في تحديث الموظف:', {
      message: error?.message,
      responseData: error?.response?.data,
      stack: error?.stack,
    })
    const apiMessage = error?.response?.data?.message || error?.response?.data || error?.message
    throw new Error(apiMessage || 'فشل في تحديث الموظف')
  }
}

export async function deleteEmployee(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data as IEmployee
}

export async function restoreEmployee(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as IEmployee
}
