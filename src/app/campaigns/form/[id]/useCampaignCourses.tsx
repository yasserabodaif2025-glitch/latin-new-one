import { useEffect, useState } from 'react'
import { getCourseByCampaignRefrence } from './lead-campaign.action'
import { ICourse } from '@/app/[locale]/courses/(components)/course.interface'

export const useCampaignCourses = (refrenceId: string) => {
  const [courses, setCourses] = useState<ICourse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchLabs = async () => {
      setIsLoading(true)
      const courses = await getCourseByCampaignRefrence(refrenceId)
      setCourses(courses)
      setIsLoading(false)
    }
    fetchLabs()
    return () => {
      setCourses([])
    }
  }, [])
  return { courses, isLoading }
}
