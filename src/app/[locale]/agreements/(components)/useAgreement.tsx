'use client'

import { useEffect, useState } from 'react'
import { getAgreements } from '../agreement.action'
import { IAgreement } from './agreement.interface'

export const useAgreements = () => {
  const [agreements, setAgreements] = useState<IAgreement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await getAgreements()
        
        // Handle different response structures
        if (response?.data) {
          setAgreements(Array.isArray(response.data) ? response.data : [])
        } else if (Array.isArray(response)) {
          setAgreements(response)
        } else {
          setAgreements([])
        }
      } catch (err) {
        console.error('Error fetching agreements:', err)
        setError('Failed to fetch agreements')
        setAgreements([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchAgreements()
  }, [])

  return { agreements, isLoading, error }
}
