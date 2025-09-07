import { CourseForm } from '../../(components)'
import { formMode } from '@/lib/const/form-mode.enum'
import { getCourse } from '../../course.action'

export default async function ViewCoursePage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const data = await getCourse(id)
  return <CourseForm mode={formMode.edit} data={data} />
}
