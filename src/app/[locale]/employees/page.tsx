import { EmployeeTable } from './(components)/employee-table'
import { getEmployees } from './employee.action'
import { getLocale } from 'next-intl/server'
import { redirect } from 'next/navigation'

export default async function EmployeesPage() {
  try {
    const employees = await getEmployees()
    return <EmployeeTable data={employees.data} />
  } catch (error: any) {
    const locale = await getLocale()
    if (error?.response?.status === 401) {
      redirect(`/${locale}/auth/login`)
    }
    throw error
  }
}
