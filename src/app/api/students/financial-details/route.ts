import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const serverBase = process.env.API_URL?.replace(/\/+$/, '') || 'http://198.7.125.213:5000/api'

interface StudentFinancialDetails {
  studentId: number
  studentName: string
  email?: string
  phone?: string
  balances?: any
  serviceCharges?: any[]
  totalBalance?: number
  totalOwed?: number
  status: 'success' | 'error'
  error?: string
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = cookies().get('token')?.value
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {})
  }
  
  if (token) {
    headers['authorization'] = `Bearer ${token}`
  }
  
  return fetch(url, {
    ...options,
    headers
  })
}

async function getAllStudents(page: number = 1, limit: number = 1000) {
  try {
    const response = await fetchWithAuth(
      `${serverBase}/Students/pagination?Page=${page}&Limit=${limit}`
    )
    
    if (!response.ok) {
      throw new Error(`Failed to fetch students: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching students:', error)
    throw error
  }
}

async function getStudentBalances(studentId: number) {
  try {
    const response = await fetchWithAuth(
      `${serverBase}/FinancialOperations/student/balances/${studentId}`
    )
    
    if (!response.ok) {
      if (response.status === 404) {
        return null // No balance data found
      }
      throw new Error(`Failed to fetch balances: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Error fetching balances for student ${studentId}:`, error)
    return null
  }
}

async function getStudentServiceCharges(studentId: number) {
  try {
    const response = await fetchWithAuth(
      `${serverBase}/FinancialOperations/student/service-charges/${studentId}`
    )
    
    if (!response.ok) {
      if (response.status === 404) {
        return []
      }
      throw new Error(`Failed to fetch service charges: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Error fetching service charges for student ${studentId}:`, error)
    return []
  }
}

function calculateTotalBalance(balances: any): { totalBalance: number; totalOwed: number } {
  if (!balances) {
    return { totalBalance: 0, totalOwed: 0 }
  }
  
  let totalBalance = 0
  let totalOwed = 0
  
  // Handle different balance structure formats
  if (Array.isArray(balances)) {
    balances.forEach((balance: any) => {
      if (balance.amount) {
        if (balance.amount > 0) {
          totalBalance += balance.amount
        } else {
          totalOwed += Math.abs(balance.amount)
        }
      }
    })
  } else if (typeof balances === 'object') {
    // Handle object structure
    Object.values(balances).forEach((value: any) => {
      if (typeof value === 'number') {
        if (value > 0) {
          totalBalance += value
        } else {
          totalOwed += Math.abs(value)
        }
      }
    })
  }
  
  return { totalBalance, totalOwed }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '1000')
    const includeDetails = searchParams.get('includeDetails') === 'true'
    
    console.log('🔧 Fetching students financial details:', { page, limit, includeDetails })
    
    // Fetch all students
    const studentsResponse = await getAllStudents(page, limit)
    
    if (!studentsResponse?.data) {
      return NextResponse.json(
        { error: 'No students data found' },
        { status: 404 }
      )
    }
    
    const students = studentsResponse.data
    console.log(`📊 Found ${students.length} students`)
    
    // Fetch financial details for each student
    const financialDetails: StudentFinancialDetails[] = await Promise.all(
      students.map(async (student: any) => {
        try {
          const [balances, serviceCharges] = await Promise.all([
            getStudentBalances(student.id),
            includeDetails ? getStudentServiceCharges(student.id) : Promise.resolve([])
          ])
          
          const { totalBalance, totalOwed } = calculateTotalBalance(balances)
          
          return {
            studentId: student.id,
            studentName: student.name,
            email: student.email,
            phone: student.phone,
            balances: includeDetails ? balances : undefined,
            serviceCharges: includeDetails ? serviceCharges : undefined,
            totalBalance,
            totalOwed,
            status: 'success' as const
          }
        } catch (error) {
          console.error(`Error processing student ${student.id}:`, error)
          return {
            studentId: student.id,
            studentName: student.name,
            email: student.email,
            phone: student.phone,
            totalBalance: 0,
            totalOwed: 0,
            status: 'error' as const,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      })
    )
    
    // Calculate summary statistics
    const summary = {
      totalStudents: financialDetails.length,
      studentsWithBalance: financialDetails.filter(s => s.totalBalance > 0).length,
      studentsWithDebt: financialDetails.filter(s => s.totalOwed > 0).length,
      totalSystemBalance: financialDetails.reduce((sum, s) => sum + s.totalBalance, 0),
      totalSystemDebt: financialDetails.reduce((sum, s) => sum + s.totalOwed, 0),
      successfulFetches: financialDetails.filter(s => s.status === 'success').length,
      failedFetches: financialDetails.filter(s => s.status === 'error').length
    }
    
    return NextResponse.json({
      success: true,
      summary,
      students: financialDetails,
      pagination: {
        page,
        limit,
        total: studentsResponse.total || students.length,
        hasMore: studentsResponse.hasMore || false
      }
    })
    
  } catch (error) {
    console.error('Error in students financial details API:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch students financial details',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
