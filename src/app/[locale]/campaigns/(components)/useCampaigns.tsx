import { useEffect, useState } from 'react'
import { getCampaigns } from '../campaign.action'
import { ICampaign } from './campaign.interface'

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<ICampaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchLabs = async () => {
      setIsLoading(true)
      const campaigns = await getCampaigns()
      setCampaigns(campaigns.data)
      setIsLoading(false)
    }
    fetchLabs()
    return () => {
      setCampaigns([])
    }
  }, [])
  return { campaigns, isLoading }
}
