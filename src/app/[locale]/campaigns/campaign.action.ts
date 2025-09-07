'use server'

import { apis } from '@/lib/const/api.enum'
import { ICampaign } from './(components)'
import { CampaignSchema } from '@/lib/schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'

const url = `${apis.campaigns}`

export async function getCampaigns() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<ICampaign[]>
}

export async function getCampaign(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as ICampaign
}

export async function createCampaign(data: CampaignSchema) {
  const res = await axiosInstance.post(url, data)
  return res.data as ICampaign
}

export async function updateCampaign(id: number, data: CampaignSchema) {
  const res = await axiosInstance.put(`${url}/${id}`, data)
  return res.data as ICampaign
}

export async function deleteCampaign(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreCampaign(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as ICampaign
}
