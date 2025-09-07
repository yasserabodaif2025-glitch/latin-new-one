import { z } from 'zod'

export const EmployeeStatus = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  TRAINING: 'TRAINING',
  TERMINATED: 'TERMINATED',
} as const

export const employeeSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().optional(),
  phone: z.string(),
  address: z.string().nonempty(),
  nationalId: z.string().nonempty(),
  birthDate: z.string().nonempty(),
  cityId: z.number(),
  department: z.string().nonempty(),
  salary: z.number(),
  salaryTypeId: z.number(),
  jobTitle: z.string().nonempty(),
  status: z.enum([
    EmployeeStatus.ACTIVE,
    EmployeeStatus.SUSPENDED,
    EmployeeStatus.TRAINING,
    EmployeeStatus.TERMINATED,
  ]),
  educationalQualificationId: z.number(),
  roleId: z.number(),
})

export type EmployeeSchema = z.infer<typeof employeeSchema>
