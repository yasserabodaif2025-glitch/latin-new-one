import { ILead } from '@/app/[locale]/leads/(components)/lead.interface'

export interface ICampaign {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
  // status: string
  coursesIds: number[]
  branchIds: number[]
  leads: ILead[]
  referenceId: number
}
