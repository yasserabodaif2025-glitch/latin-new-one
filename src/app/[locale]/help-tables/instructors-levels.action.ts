'use server'

import { apis } from '@/lib/const/api.enum'
import { axiosInstance } from '@/lib/axiosInstance'
import { InstructorsLevelsResponse } from './(components)'

export async function getInstructorsLevels(id: number): Promise<InstructorsLevelsResponse> {
  const res = await axiosInstance.get(`${apis.instructorsLevels}/${id}`)
  return res.data as InstructorsLevelsResponse
}
