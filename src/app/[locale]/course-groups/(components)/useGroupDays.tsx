import { useEffect, useState } from 'react'
import { getCourseGroupDays } from '../course-group.action'
import { ICourseGroupDay } from './course-group.interface'

export const useGroupDays = () => {
  const [groupDays, setGroupDays] = useState<ICourseGroupDay[]>([])
  useEffect(() => {
    const fetchGroupDays = async () => {
      const groupDays = await getCourseGroupDays()
      setGroupDays(groupDays)
    }
    fetchGroupDays()
    return () => {
      setGroupDays([])
    }
  }, [])
  return groupDays
}
