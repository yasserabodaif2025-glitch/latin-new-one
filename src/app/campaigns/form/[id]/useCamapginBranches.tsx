import { useEffect, useState } from 'react'
import { getBranchByCampaignRefrence } from './lead-campaign.action'
import { IBranch } from '@/app/[locale]/branches/(components)/branch.interface'

export const useCampaignBranches = (refrenceId: string) => {
  const [branches, setBranches] = useState<IBranch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchBranches = async () => {
      setIsLoading(true)
      const branches = await getBranchByCampaignRefrence(refrenceId)
      setBranches(branches)
      setIsLoading(false)
    }
    fetchBranches()
    return () => {
      setBranches([])
    }
  }, [])
  return { branches, isLoading }
}
