import { useEffect, useState } from 'react'
import { getLabTypes } from '../lab.action'
import { ILabType } from './lab.interface'
export const useLabTypes = () => {
  const [labTypes, setLabTypes] = useState<ILabType[]>([])
  useEffect(() => {
    const fetchLabTypes = async () => {
      const labTypes = await getLabTypes()
      setLabTypes(labTypes)
    }
    fetchLabTypes()
    return () => {
      setLabTypes([])
    }
  }, [])
  return labTypes
}
