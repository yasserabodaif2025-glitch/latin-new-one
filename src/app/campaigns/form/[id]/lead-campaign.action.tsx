import { apis } from '@/lib/const/api.enum'
import axios from 'axios'
import { formSchema } from './genrated-form'
import { z } from 'zod'

const baseUrl = apis.baseUrl

const url = (path: string, refrenceId: string) =>
  `${baseUrl}Campaigns/${path}-by-reference/${refrenceId}`

export const getCourseByCampaignRefrence = async (refrenceId: string) => {
  const res = await axios.get(url('courses', refrenceId))
  return res.data
}

export const getBranchByCampaignRefrence = async (refrenceId: string) => {
  const res = await axios.get(url('branches', refrenceId))
  return res.data
}

export const createLead = async (lead: z.infer<typeof formSchema>) => {
  const res = await axios.post(baseUrl + apis.campaignLeads, lead, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res.data
}
