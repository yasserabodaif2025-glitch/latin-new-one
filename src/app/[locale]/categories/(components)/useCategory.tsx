import { useEffect, useState } from 'react'
import { getCategories } from '../category.action'
import { ICategory } from './category.interface'

export const useCategories = () => {
  const [categories, setCategories] = useState<ICategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await getCategories()
        if (!isMounted) return
        
        if (response?.data) {
          setCategories(Array.isArray(response.data) ? response.data : [])
        } else if (Array.isArray(response)) {
          setCategories(response)
        } else {
          setCategories([])
        }
      } catch (err) {
        if (!isMounted) return
        setError('Failed to fetch categories')
        setCategories([])
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    
    fetchCategories()
    
    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])
  
  return { categories, isLoading, error }
}
