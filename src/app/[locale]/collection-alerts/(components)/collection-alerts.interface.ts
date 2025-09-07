export interface IStudentBalance {
  studentId: number
  studentName: string
  studentPhone: string
  groupId: number
  groupName: string
  courseName: string
  levelName: string
  totalAmount: number
  paidAmount: number
  remainingBalance: number
  lastPaymentDate: string | null
  dueDate: string
}

export interface ICollectionFilters {
  studentName?: string
  groupId?: number
  minAmount?: number
  maxAmount?: number
  dueDateFrom?: string
  dueDateTo?: string
}
