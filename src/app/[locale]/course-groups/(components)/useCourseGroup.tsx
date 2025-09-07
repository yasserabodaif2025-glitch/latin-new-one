import { useEffect, useState } from 'react'
import { getCourseGroups } from '../course-group.action'
import { ICourseGroup } from './course-group.interface'

export const useCourseGroup = () => {
  const [courseGroups, setCourseGroups] = useState<ICourseGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    
    const fetchCourseGroups = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await getCourseGroups()
        if (!isMounted) return
        
        if (response?.data) {
          setCourseGroups(Array.isArray(response.data) ? response.data : [])
        } else if (Array.isArray(response)) {
          setCourseGroups(response)
        } else {
          setCourseGroups([])
        }
      } catch (err) {
        if (!isMounted) return
        setError('Failed to fetch course groups')
        setCourseGroups([])
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    
    fetchCourseGroups()
    
    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])
  
  return { courseGroups, isLoading, error }
}
