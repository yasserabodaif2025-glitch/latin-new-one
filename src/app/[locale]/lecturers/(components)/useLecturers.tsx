import { useEffect, useState } from 'react'
import { getLecturers } from '../lecturer.action'
import { ILecturer } from './lecturer.interface'

export const useLecturers = () => {
  const [lecturers, setLecturers] = useState<ILecturer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    
    const fetchLecturers = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await getLecturers()
        if (!isMounted) return
        
        if (response?.data) {
          setLecturers(Array.isArray(response.data) ? response.data : [])
        } else if (Array.isArray(response)) {
          setLecturers(response)
        } else {
          setLecturers([])
        }
      } catch (err) {
        if (!isMounted) return
        setError('Failed to fetch lecturers')
        setLecturers([])
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    
    fetchLecturers()
    
    return () => {
      isMounted = false
    }
  }, [])
  
  return { lecturers, isLoading, error }
}
