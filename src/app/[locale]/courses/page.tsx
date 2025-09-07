import { getCourses } from './course.action'
import { CourseMainView } from './(components)/course-main-view'

export default async function CoursePage() {
  const courses = await getCourses()
  return <CourseMainView data={courses.data} />
}
