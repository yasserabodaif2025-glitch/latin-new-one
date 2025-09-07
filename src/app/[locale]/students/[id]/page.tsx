import { StudentForm } from '../(components)'
import { formMode } from '@/lib/const/form-mode.enum'
import { getStudent } from '../student.action'

export default async function ViewStudentPage({ params }: any) {
  const id = Number(params.id)
  const data = await getStudent(id)
  return <StudentForm mode={formMode.view} data={data} />
}
