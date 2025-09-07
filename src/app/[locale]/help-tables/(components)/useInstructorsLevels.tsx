'use client'
import { useEffect, useState } from 'react'
import { getInstructorsLevels } from '../instructors-levels.action'
import { InstructorsLevelsResponse } from './instructors-levels.interface'

export const useInstructorsLevels = (id: number) => {
  const [data, setData] = useState<InstructorsLevelsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const result = await getInstructorsLevels(id)
      setData(result)
      setIsLoading(false)
    }
    fetchData()
    return () => {
      setData(null)
      setIsLoading(true)
    }
  }, [id])

  return { data, isLoading }
}
