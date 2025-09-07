'use client'

import { useEffect, useState } from 'react'
import { getAreas } from '../area.action'
import { IArea } from './area.interface'

export const useAreas = () => {
  const [areas, setAreas] = useState<IArea[]>([])
  useEffect(() => {
    const fetchAreas = async () => {
      const areas = await getAreas()
      setAreas(areas.data)
    }
    fetchAreas()
    return () => {
      setAreas([])
    }
  }, [])
  return areas
}
