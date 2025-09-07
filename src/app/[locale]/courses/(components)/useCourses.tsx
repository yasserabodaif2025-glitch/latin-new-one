import { useEffect, useState } from 'react'
import { getCourses } from '../course.action'
import { ICourse } from './course.interface'

export const useCourses = () => {
  const [courses, setCourses] = useState<ICourse[]>([])
  useEffect(() => {
    const fetchCourses = async () => {
      const courses = await getCourses()
      setCourses(courses.data)
    }
    fetchCourses()
    return () => {
      setCourses([])
    }
  }, [])
  return courses
}
