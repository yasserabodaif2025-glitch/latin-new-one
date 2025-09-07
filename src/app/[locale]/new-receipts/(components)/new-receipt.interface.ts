export interface INewReceipt {
  id: number
  studentId: number
  studentName: string
  amount: number
  date: string
  receiptNumber?: string
  description: string
  type: string
  receiptType?: string
  createdBy: string
  createdAt?: string
  enrollment?: string
  serviceType?: string
}

export interface IStudentBalance {
  enrollmentId: number
  levelId: number
  courseName: string
  levelName: string
  groupName: string
  totalFee: number
  paidAmount: number
  remainingBalance: number
  discount: number
}
