import { EmployeeStatus } from '@/lib/schema/employee.schema'

export interface IEmployee {
  id?: number
  name: string
  email: string
  password?: string
  phone: string
  address: string
  nationalId: string
  birthDate: string
  cityId: number
  department: string
  salary: number
  salaryTypeId: number
  jobTitle: string
  status: keyof typeof EmployeeStatus
  educationalQualificationId: number
  roleId: number
  createdAt?: string
  updatedAt?: string
}
