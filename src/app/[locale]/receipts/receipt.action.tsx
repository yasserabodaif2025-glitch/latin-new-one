'use server'

import { IReceipt } from './(components)/receipt.interface'
import { ReceiptSchema } from '@/lib/schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'
import { getMyExpenses, getStudentPaymentHistory } from '@/lib/api/financial.service'

// Helper function to get current employee ID
async function getCurrentEmployeeId(): Promise<number> {
  try {
    console.log('🔍 Getting current employee ID...')
    
    // Get the token from cookies
    const { getToken } = await import('@/app/[locale]/auth/token.action')
    const token = await getToken()
    
    if (!token) {
      console.warn('❌ No authentication token found')
      throw new Error('No authentication token found')
    }

    try {
      // Decode the JWT token
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const payload = JSON.parse(atob(base64))
      
      console.log('📋 Decoded token payload:', payload)
      
      // Try different possible claims for employee ID
      const employeeId = payload?.employeeId || 
                        payload?.userId || 
                        payload?.sub || 
                        payload?.id
      
      if (!employeeId) {
        throw new Error('No employee ID found in token')
      }
      
      const parsedId = parseInt(employeeId.toString(), 10)
      
      if (isNaN(parsedId)) {
        throw new Error(`Invalid employee ID format: ${employeeId}`)
      }
      
      console.log('✅ Employee ID found in token:', parsedId)
      return parsedId
      
    } catch (decodeError) {
      console.error('❌ Error decoding token:', decodeError)
      throw new Error('Failed to decode authentication token')
    }
    
  } catch (error) {
    console.error('❌ Error getting employee ID:', error)
    // Instead of returning a default value, rethrow the error
    // to fail fast and make the issue more visible
    throw new Error(`Failed to get employee ID: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Helper function to get receipts from various sources
async function getReceiptsFromMultipleSources(): Promise<{ data: IReceipt[] }> {
  console.log('🔄 Getting receipts from multiple sources...')
  const allReceipts: IReceipt[] = []
  
  try {
    console.log('📊 Trying to get from expenses...')
    // Try to get from expenses
    const expenses = await getMyExpenses({
      page: 1,
      pageSize: 100,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
    
    console.log('📈 Expenses response:', expenses)
    
    if (expenses && expenses.items && Array.isArray(expenses.items)) {
      console.log(`📋 Found ${expenses.items.length} expenses`)
      
      const expenseReceipts: IReceipt[] = expenses.items.map((expense: any) => ({
        id: expense.id || Math.random(),
        studentId: 0,
        studentName: expense.description || 'مصروف',
        amount: expense.amount || 0,
        date: expense.createdAt || new Date().toISOString(),
        receiptNumber: `EXP-${expense.id || Math.random()}`,
        description: expense.description || '',
        type: 'expense',
        createdBy: expense.createdBy || 'موظف',
        enrollment: '',
        serviceType: 'مصروف'
      }))
      
      console.log('💰 Expense receipts created:', expenseReceipts)
      allReceipts.push(...expenseReceipts)
    } else {
      console.log('⚠️ No expenses found or invalid format')
    }
  } catch (error) {
    console.warn('❌ Could not fetch expenses:', error)
  }
  
  // Try to get from daily cash report
  try {
    const today = new Date().toISOString().split('T')[0]
    const response = await axiosInstance.get(`Financial/daily-cash-report?reportDate=${today}`)
    
    if (response.data?.items && Array.isArray(response.data.items)) {
      const reportReceipts: IReceipt[] = response.data.items.map((item: any) => ({
        id: item.id || Math.random(),
        studentId: 0,
        studentName: item.description || 'تقرير نقدي',
        amount: item.amount || 0,
        date: item.date || today,
        receiptNumber: `RPT-${item.id || Math.random()}`,
        description: item.description || '',
        type: 'daily_report',
        createdBy: 'نظام',
        enrollment: '',
        serviceType: 'تقرير نقدي'
      }))
      
      allReceipts.push(...reportReceipts)
    }
  } catch (error) {
    console.warn('Could not fetch daily cash report:', error)
  }
  
  // Sort by date (newest first)
  allReceipts.sort((a, b) => {
    try {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    } catch (dateError) {
      console.warn('Invalid date format in sorting:', a.date, b.date)
      return 0
    }
  })
  
  return { data: allReceipts }
}

export async function getReceipts() {
  try {
    // First try the direct receipts endpoint
    try {
      const response = await axiosInstance.get(`FinancialOperations/receipts?_=${new Date().getTime()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (apiError: any) {
      console.warn('Direct receipts endpoint not available, trying alternative sources...')
      
      // If direct endpoint fails, try to get from multiple sources
      return await getReceiptsFromMultipleSources()
    }
  } catch (error: any) {
    console.error('خطأ في جلب الإيصالات:', error)
    // Return empty array instead of throwing error to prevent page crash
    return { data: [] }
  }
}

// Get receipts for today only using the specific API endpoint
export async function getTodayReceipts() {
  try {
    console.log('🚀 Starting getTodayReceipts...')
    
    // First try the specific API endpoint for employee receipts by date
    const today = new Date().toISOString().split('T')[0]
    console.log('📅 Today date:', today)
    
    const employeeId = await getCurrentEmployeeId()
    console.log('👤 Employee ID:', employeeId)
    
    try {
      console.log(`🔍 Fetching receipts for employee ${employeeId} on date ${today}`)
      const apiUrl = `FinancialOperations/${employeeId}/${today}`
      console.log('🌐 API URL:', apiUrl)
      
      const response = await axiosInstance.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('📡 API response status:', response.status)
      console.log('📡 API response data:', response.data)
      
      // Transform the response to receipt format if needed
      const receipts = response.data?.data || response.data || []
      const formattedReceipts = Array.isArray(receipts) ? receipts : []
      
      console.log(`✅ Found ${formattedReceipts.length} receipts for today from API`)
      console.log('📋 Formatted receipts:', formattedReceipts)
      return { data: formattedReceipts }
      
    } catch (apiError: any) {
      console.warn('⚠️ Employee receipts API not available, trying alternative sources...')
      console.warn('❌ API Error:', apiError.message)
      console.warn('❌ API Error status:', apiError.response?.status)
      console.warn('❌ API Error data:', apiError.response?.data)
      
      // Fallback to the previous method if the specific API doesn't work
      console.log('🔄 Falling back to multiple sources...')
      const allReceipts = await getReceiptsFromMultipleSources()
      console.log('📊 All receipts from multiple sources:', allReceipts)
      
      // Filter receipts for today only
      const todayReceipts = allReceipts.data.filter(receipt => {
        try {
          const receiptDate = new Date(receipt.date).toISOString().split('T')[0]
          return receiptDate === today
        } catch (dateError) {
          console.warn('❌ Invalid date format:', receipt.date)
          return false
        }
      })
      
      console.log(`✅ Found ${todayReceipts.length} receipts from alternative sources`)
      console.log('📋 Today receipts from fallback:', todayReceipts)
      return { data: todayReceipts }
    }
  } catch (error: any) {
    console.error('❌ خطأ في جلب إيصالات اليوم:', error)
    // Return empty array instead of throwing error to prevent page crash
    return { data: [] }
  }
}

// Get receipts for a specific date using the specific API endpoint
export async function getReceiptsByDate(date: string) {
  try {
    const employeeId = await getCurrentEmployeeId()
    
    try {
      console.log(`Fetching receipts for employee ${employeeId} on date ${date}`)
      const response = await axiosInstance.get(`FinancialOperations/${employeeId}/${date}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('API response for date:', response.data)
      
      // Transform the response to receipt format if needed
      const receipts = response.data?.data || response.data || []
      const formattedReceipts = Array.isArray(receipts) ? receipts : []
      
      console.log(`Found ${formattedReceipts.length} receipts for date ${date}`)
      return { data: formattedReceipts }
      
    } catch (apiError: any) {
      console.warn('Employee receipts API not available for date:', date, apiError.message)
      
      // Fallback to the previous method if the specific API doesn't work
      const allReceipts = await getReceiptsFromMultipleSources()
      
      // Filter receipts for the specific date
      const dateReceipts = allReceipts.data.filter(receipt => {
        try {
          const receiptDate = new Date(receipt.date).toISOString().split('T')[0]
          return receiptDate === date
        } catch (dateError) {
          console.warn('Invalid date format:', receipt.date)
          return false
        }
      })
      
      console.log(`Found ${dateReceipts.length} receipts from alternative sources for date ${date}`)
      return { data: dateReceipts }
    }
  } catch (error: any) {
    console.error('خطأ في جلب الإيصالات للتاريخ:', date, error)
    // Return empty array instead of throwing error to prevent page crash
    return { data: [] }
  }
}

export async function getReceipt(id: number) {
  try {
    // Since the receipts endpoint doesn't exist, we'll throw an error for now
    throw new Error('Receipts endpoint not available in API')
  } catch (error: any) {
    console.error('خطأ في جلب الإيصال:', error)
    throw new Error(error.message || 'فشل في جلب الإيصال')
  }
}

export async function createReceipt(data: ReceiptSchema) {
  console.log('💾 Creating receipt with data:', data)
  
  try {
    // Get the current employee ID
    const employeeId = await getCurrentEmployeeId()
    console.log('👤 Using employee ID:', employeeId)
    
    if (data.receiptType === 'student_payment') {
      const payload = {
        enrollmentId: data.enrollmentId,
        amount: data.amount,
        description: data.description,
        employeeId: employeeId, // Add employee ID to the payload
        createdBy: employeeId,  // Also include in createdBy field if needed by the API
      }
      console.log('🎓 Student payment payload:', payload)
      
      const res = await axiosInstance.post('FinancialOperations/student/pay', payload)
      console.log('✅ Student payment response:', res.data)
      return res.data
    } else if (data.receiptType === 'service_charge') {
      const payload = {
        studentId: data.studentId,
        serviceType: data.serviceType,
        amount: data.amount,
        description: data.description,
        employeeId: employeeId, // Add employee ID to the payload
        createdBy: employeeId,  // Also include in createdBy field if needed by the API
      }
      console.log('🔧 Service charge payload:', payload)
      
      const res = await axiosInstance.post('FinancialOperations/service-charge', payload)
      console.log('✅ Service charge response:', res.data)
      return res.data
    } else if (data.receiptType === 'expense') {
      const payload = {
        amount: data.amount,
        description: data.description,
        employeeId: employeeId, // Add employee ID to the payload
        createdBy: employeeId,  // Also include in createdBy field if needed by the API
      }
      console.log('💰 Expense payload:', payload)
      
      const res = await axiosInstance.post('FinancialOperations/my-expense', payload)
      console.log('✅ Expense response:', res.data)
      return res.data
    }
    
    console.warn('⚠️ Unknown receipt type:', data.receiptType)
    throw new Error(`نوع الإيصال غير معروف: ${data.receiptType}`)
  } catch (error) {
    console.error('❌ Error creating receipt:', error)
    throw new Error(error instanceof Error ? error.message : 'فشل في إنشاء الإيصال')
  }
}

export async function updateReceipt(id: number, data: ReceiptSchema) {
  try {
    // Since the receipts endpoint doesn't exist, we'll throw an error for now
    throw new Error('Receipts endpoint not available in API')
  } catch (error: any) {
    console.error('خطأ في تحديث الإيصال:', error)
    throw new Error(error.message || 'فشل في تحديث الإيصال')
  }
}

export async function deleteReceipt(id: number) {
  try {
    // Since the receipts endpoint doesn't exist, we'll throw an error for now
    throw new Error('Receipts endpoint not available in API')
  } catch (error: any) {
    console.error('خطأ في حذف الإيصال:', error)
    throw new Error(error.message || 'فشل في حذف الإيصال')
  }
}

export async function restoreReceipt(id: number) {
  try {
    // Since the receipts endpoint doesn't exist, we'll throw an error for now
    throw new Error('Receipts endpoint not available in API')
  } catch (error: any) {
    console.error('خطأ في استعادة الإيصال:', error)
    throw new Error(error.message || 'فشل في استعادة الإيصال')
  }
}

/**
 * إلغاء إيصال باستخدام رقم الإيصال
 */
export async function cancelReceipt(receiptNumber: string) {
  try {
    // Since the receipts endpoint doesn't exist, we'll throw an error for now
    throw new Error('Receipts endpoint not available in API')
  } catch (error: any) {
    console.error('خطأ في إلغاء الإيصال:', error)
    throw new Error(error.message || 'فشل في إلغاء الإيصال')
  }
}
