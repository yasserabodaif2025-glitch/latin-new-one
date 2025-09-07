'use server'

import { apis } from '@/lib/const/api.enum'
import { axiosInstance } from '@/lib/axiosInstance'
import { IStudentBalance } from './(components)/collection-alerts.interface'

const url = apis.collectionAlerts

export async function getStudentsWithBalance() {
  const res = await axiosInstance.get(`${url}/students-balance`)
  return res.data
}

export async function getGroupBalances() {
  const res = await axiosInstance.get(`${url}/group-balances`)
  return res.data
}

export async function sendReminder(studentId: number) {
  const res = await axiosInstance.post(`${url}/send-reminder/${studentId}`)
  return res.data
}
