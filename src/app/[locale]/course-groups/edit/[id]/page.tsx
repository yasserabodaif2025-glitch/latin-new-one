import { CourseGroupForm } from '../../(components)'
import { formMode } from '@/lib/const/form-mode.enum'
import { getCourseGroup } from '../../course-group.action'

export default async function EditCourseGroupPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const data = await getCourseGroup(id)
  return <CourseGroupForm mode={formMode.edit} data={data} />
}
