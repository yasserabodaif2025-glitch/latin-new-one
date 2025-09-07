import { StudentForm } from '../../(components)'
import { formMode } from '@/lib/const/form-mode.enum'
import { getStudent } from '../../student.action'

export default async function ViewStudentPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const data = await getStudent(id)
  return <StudentForm mode={formMode.edit} data={data} />
}
