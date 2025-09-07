export interface IEmployee {
  id: number
  name: string
  email: string
  phone: string
  address: string
  nationalId: string
  birthDate: string
  cityId: number
  cityName?: string
  department: string
  salary: number
  salaryTypeId: number
  salaryTypeName?: string
  jobTitle: string
  status: 'ACTIVE' | 'SUSPENDED' | 'TRAINING' | 'TERMINATED'
  educationalQualificationId: number
  educationalQualificationName?: string
  roleId: number
  roleName?: string
}
