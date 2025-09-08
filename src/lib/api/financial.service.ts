import { axiosInstance } from '@/lib/axiosInstance'
import { 
  CreateExpenseDto, 
  CreateStaffExpenseDto, 
  ExpenseDto, 
  ExpensePaginationResult,
  ExpenseQueryParams,
  ReceiptDto,
  ReceiptPaginationResult,
  ReceiptQueryParams
} from '@/types/financial.types'

// Base groups (per swagger additions)
const FINANCIAL = 'Financial'
const FINANCIAL_OPERATIONS = 'FinancialOperations'

// Shared helpers
const toQuery = (params: Record<string, any>): string => {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      q.append(k, String(v))
    }
  })
  return q.toString()
}

// ============ Expense Operations ============

/**
 * Create a new expense
 * POST /api/FinancialOperations/expense
 */
export async function createExpense(expense: CreateExpenseDto): Promise<ExpenseDto> {
  const { data } = await axiosInstance.post<ExpenseDto>(
    `${FINANCIAL_OPERATIONS}/expense`,
    expense
  )
  return data
}

/**
 * Create a new staff expense
 * POST /api/FinancialOperations/my-expense
 */
export async function createStaffExpense(
  expense: CreateStaffExpenseDto
): Promise<ExpenseDto> {
  const { data } = await axiosInstance.post<ExpenseDto>(
    `${FINANCIAL_OPERATIONS}/my-expense`,
    expense
  )
  return data
}

/**
 * Get paginated list of expenses
 * GET /api/FinancialOperations/my-expense
 */
export async function getMyExpenses(
  params: ExpenseQueryParams = {}
): Promise<ExpensePaginationResult> {
  const { 
    page = 1, 
    pageSize = 10, 
    sortBy = 'createdAt', 
    sortOrder = 'desc',
    fromDate,
    toDate,
    ...rest
  } = params
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    sortField: sortBy,
    sortOrder,
    ...(fromDate && { from: fromDate }),
    ...(toDate && { to: toDate }),
    ...rest
  })
  
  const { data } = await axiosInstance.get<ExpensePaginationResult>(
    `${FINANCIAL_OPERATIONS}/my-expense?${queryParams}`
  )
  
  return {
    items: data.items || [],
    total: data.total || 0,
    page: data.page || 1,
    pageSize: data.pageSize || 10,
    hasMore: data.hasMore || false,
  }
}

/**
 * Get paginated list of receipts
 * GET /api/FinancialOperations/receipts
 */
export async function getReceipts(
  params: ReceiptQueryParams = {}
): Promise<ReceiptPaginationResult> {
  const { 
    page = 1, 
    pageSize = 10, 
    sortBy = 'createdAt', 
    sortOrder = 'desc',
    fromDate,
    toDate,
    employeeId,
    ...rest
  } = params
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    sortField: sortBy,
    sortOrder,
    ...(fromDate && { from: fromDate }),
    ...(toDate && { to: toDate }),
    ...(employeeId && { employeeId: employeeId.toString() }),
    ...rest
  })
  
  const { data } = await axiosInstance.get<ReceiptPaginationResult>(
    `${FINANCIAL_OPERATIONS}/receipts?${queryParams}`
  )
  
  return {
    items: data.items || [],
    total: data.total || 0,
    page: data.page || 1,
    pageSize: data.pageSize || 10,
    hasMore: data.hasMore || false,
  }
}

// ============ Student Payment ============
// POST /api/Financial/student-payment?studentId=&amount=&description=
export async function postStudentPayment(params: {
  studentId: number
  amount: number
  description?: string
}) {
  const qs = toQuery(params)
  const { data } = await axiosInstance.post(`${FINANCIAL}/student-payment?${qs}`)
  return data
}

// POST /api/Financial/student-payment/enrollment (body)
export async function postStudentPaymentEnrollment(body: any) {
  const { data } = await axiosInstance.post(`${FINANCIAL}/student-payment/enrollment`, body)
  return data
}

// GET /api/Financial/student-payment/history/{studentId}
export async function getStudentPaymentHistory(studentId: number) {
  const { data } = await axiosInstance.get(`${FINANCIAL}/student-payment/history/${studentId}`)
  return data
}

// GET /api/Financial/student-payment/{id}
export async function getStudentPaymentById(id: number) {
  const { data } = await axiosInstance.get(`${FINANCIAL}/student-payment/${id}`)
  return data
}

// ============ Expense (General) ============
// POST /api/Financial/expense?fromSafeId=&amount=&expenseAccountCode=&description=
export async function postExpense(params: {
  fromSafeId: number
  amount: number
  expenseAccountCode: string
  description?: string
}) {
  const { data } = await axiosInstance.post(`${FINANCIAL}/expense?${toQuery(params)}`)
  return data
}

// ============ Pay Salary ============
// POST /api/Financial/pay-salary?employeeId=&amount=&periodStart=&periodEnd=&fromSafeId=&bonus=&deduction=&description=
export async function postPaySalary(params: {
  employeeId: number
  amount: number
  periodStart?: string // ISO date
  periodEnd?: string // ISO date
  fromSafeId?: number
  bonus?: number
  deduction?: number
  description?: string
}) {
  const { data } = await axiosInstance.post(`${FINANCIAL}/pay-salary?${toQuery(params)}`)
  return data
}

// ============ Daily Cash Report ============
// POST /api/Financial/daily-cash-report (body)
export async function createDailyCashReport(body: any) {
  const { data } = await axiosInstance.post(`${FINANCIAL}/daily-cash-report`, body)
  return data
}

// GET /api/Financial/daily-cash-report?startDate=&endDate=
export async function getDailyCashReport(params: { startDate?: string; endDate?: string }) {
  const { data } = await axiosInstance.get(`${FINANCIAL}/daily-cash-report?${toQuery(params)}`)
  return data
}

// GET /api/Financial/daily-cash-report/{id}
export async function getDailyCashReportById(id: number) {
  const { data } = await axiosInstance.get(`${FINANCIAL}/daily-cash-report/${id}`)
  return data
}

// POST /api/Financial/daily-cash-report/{id}/close
export async function closeDailyCashReport(id: number) {
  const { data } = await axiosInstance.post(`${FINANCIAL}/daily-cash-report/${id}/close`)
  return data
}

// GET /api/Financial/daily-cash-report/summary?reportDate=
export async function getDailyCashReportSummary(reportDate?: string) {
  const qs = reportDate ? `?${toQuery({ reportDate })}` : ''
  const { data } = await axiosInstance.get(`${FINANCIAL}/daily-cash-report/summary${qs}`)
  return data
}

// POST /api/Financial/daily-cash-report/close?reportDate=&mainSafeId=
export async function closeDailyCashReportByDate(params: { reportDate: string; mainSafeId: number }) {
  const { data } = await axiosInstance.post(`${FINANCIAL}/daily-cash-report/close?${toQuery(params)}`)
  return data
}

// ============ Reports ============
// GET /api/Financial/report?startDate=&endDate=
export async function getFinancialReport(params: { startDate?: string; endDate?: string }) {
  const { data } = await axiosInstance.get(`${FINANCIAL}/report?${toQuery(params)}`)
  return data
}

// GET /api/Financial/report/monthly/{year}/{month}
export async function getMonthlyReport(year: number, month: number) {
  const { data } = await axiosInstance.get(`${FINANCIAL}/report/monthly/${year}/${month}`)
  return data
}

// GET /api/Financial/report/quarterly/{year}/{quarter}
export async function getQuarterlyReport(year: number, quarter: number) {
  const { data } = await axiosInstance.get(`${FINANCIAL}/report/quarterly/${year}/${quarter}`)
  return data
}

// GET /api/Financial/report/yearly/{year}
export async function getYearlyReport(year: number) {
  const { data } = await axiosInstance.get(`${FINANCIAL}/report/yearly/${year}`)
  return data
}

// ============ Course Payment ============
// POST /api/Financial/course-payment (body)
export async function postCoursePayment(body: any) {
  const { data } = await axiosInstance.post(`${FINANCIAL}/course-payment`, body)
  return data
}

// ============ Service Charge ============
// POST /api/Financial/service-charge (body)
export async function postServiceCharge(body: any) {
  const { data } = await axiosInstance.post(`${FINANCIAL}/service-charge`, body)
  return data
}

// GET /api/Financial/service-charge/{id}
export async function getServiceChargeById(id: number) {
  const { data } = await axiosInstance.get(`${FINANCIAL}/service-charge/${id}`)
  return data
}

// GET /api/Financial/service-charge/student/{studentId}
export async function getServiceChargesByStudent(studentId: number) {
  const { data } = await axiosInstance.get(`${FINANCIAL}/service-charge/student/${studentId}`)
  return data
}

// ============ Salary Payments ============
// GET /api/Financial/salary-payments
export async function getSalaryPayments(params: { startDate?: string; endDate?: string } = {}) {
  const qs = toQuery(params)
  const { data } = await axiosInstance.get(`${FINANCIAL}/salary-payments${qs ? `?${qs}` : ''}`)
  return data
}

// GET /api/Financial/salary-payments/{employeeId}
export async function getSalaryPaymentsByEmployee(employeeId: number) {
  const { data } = await axiosInstance.get(`${FINANCIAL}/salary-payments/${employeeId}`)
  return data
}

// ============ Student Debts ============
// GET /api/Financial/student-debts/{studentId}
export async function getStudentDebts(studentId: number) {
  const { data } = await axiosInstance.get(`${FINANCIAL}/student-debts/${studentId}`)
  return data
}
