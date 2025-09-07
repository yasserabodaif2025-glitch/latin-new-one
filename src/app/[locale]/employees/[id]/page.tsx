import { EmployeeForm } from '../(components)'
import { formMode } from '@/lib/const/form-mode.enum'
import { getEmployee } from '../employee.action'

export default async function ViewEmployeePage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const employee = await getEmployee(id)

  return <EmployeeForm data={employee} mode={formMode.view} />
}
