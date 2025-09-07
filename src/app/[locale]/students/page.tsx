import { StudentTable } from './(components)'
import { getStudents } from './student.action'

export default async function StudentPage() {
  const students = await getStudents()
  return <StudentTable data={students.data} />
}
