import { formMode } from '@/lib/const/form-mode.enum'
import { EmployeeForm } from '../../(components)'
import { getEmployee } from '../../employee.action'

export default async function EditEmployeePage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params

  const employee = await getEmployee(id)

  return <EmployeeForm data={employee} mode={formMode.edit} />
}
