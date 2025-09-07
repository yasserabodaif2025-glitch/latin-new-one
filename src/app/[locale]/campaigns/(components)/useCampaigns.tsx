import { useEffect, useState } from 'react'
import { getCampaigns } from '../campaign.action'
import { ICampaign } from './campaign.interface'

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<ICampaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  useEffect(() => {
    const fetchLabs = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const campaigns = await getCampaigns()
        setCampaigns(campaigns.data)
      } catch (e: any) {
        setError(e instanceof Error ? e : new Error('Failed to load campaigns'))
        setCampaigns([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchLabs()
    return () => {
      setCampaigns([])
    }
  }, [])
  return { campaigns, isLoading, error }
}
