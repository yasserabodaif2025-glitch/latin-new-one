import { useEffect, useState } from 'react'
import { getCourseGroupStatus } from '../course-group.action'
import { ICourseGroupStatus } from './course-group.interface'

export const useGroupStatus = () => {
  const [groupStatus, setGroupStatus] = useState<ICourseGroupStatus[]>([])
  useEffect(() => {
    const fetchGroupStatus = async () => {
      const groupStatus = await getCourseGroupStatus()
      setGroupStatus(groupStatus)
    }
    fetchGroupStatus()
    return () => {
      setGroupStatus([])
    }
  }, [])
  return groupStatus
}
