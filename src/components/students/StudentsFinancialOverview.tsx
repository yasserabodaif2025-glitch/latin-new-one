'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Search, 
  DollarSign, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  Eye,
  EyeOff,
  Download
} from 'lucide-react'

interface StudentFinancialDetails {
  studentId: number
  studentName: string
  email?: string
  phone?: string
  balances?: any
  serviceCharges?: any[]
  totalBalance: number
  totalOwed: number
  status: 'success' | 'error'
  error?: string
}

interface FinancialSummary {
  totalStudents: number
  studentsWithBalance: number
  studentsWithDebt: number
  totalSystemBalance: number
  totalSystemDebt: number
  successfulFetches: number
  failedFetches: number
}

interface ApiResponse {
  success: boolean
  summary: FinancialSummary
  students: StudentFinancialDetails[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

export default function StudentsFinancialOverview() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [includeDetails, setIncludeDetails] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const fetchFinancialData = async (showDetails: boolean = false) => {
    try {
      setRefreshing(true)
      const response = await fetch(`/api/students/financial-details?includeDetails=${showDetails}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result: ApiResponse = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل البيانات')
      console.error('Error fetching financial data:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchFinancialData(includeDetails)
  }, [includeDetails])

  const filteredStudents = data?.students.filter(student =>
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone?.includes(searchTerm)
  ) || []

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const exportToCSV = () => {
    if (!data?.students) return

    const headers = ['اسم الطالب', 'البريد الإلكتروني', 'الهاتف', 'الرصيد', 'المديونية', 'الحالة']
    const csvContent = [
      headers.join(','),
      ...data.students.map(student => [
        student.studentName,
        student.email || '',
        student.phone || '',
        student.totalBalance,
        student.totalOwed,
        student.status === 'success' ? 'نجح' : 'فشل'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `students-financial-details-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchFinancialData(includeDetails)} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              إعادة المحاولة
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلاب</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.summary.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              نجح: {data?.summary.successfulFetches} | فشل: {data?.summary.failedFetches}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الأرصدة</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(data?.summary.totalSystemBalance || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {data?.summary.studentsWithBalance} طالب لديه رصيد
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المديونية</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(data?.summary.totalSystemDebt || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {data?.summary.studentsWithDebt} طالب عليه مديونية
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">صافي الرصيد</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              (data?.summary.totalSystemBalance || 0) - (data?.summary.totalSystemDebt || 0) >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {formatCurrency((data?.summary.totalSystemBalance || 0) - (data?.summary.totalSystemDebt || 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>التفاصيل المالية للطلاب</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIncludeDetails(!includeDetails)}
                disabled={refreshing}
              >
                {includeDetails ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {includeDetails ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchFinancialData(includeDetails)}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
              >
                <Download className="w-4 h-4 mr-2" />
                تصدير CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="البحث بالاسم أو البريد الإلكتروني أو الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <Card key={student.studentId} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{student.studentName}</h3>
                        <Badge variant={student.status === 'success' ? 'default' : 'destructive'}>
                          {student.status === 'success' ? 'نجح' : 'فشل'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {student.email && <p>📧 {student.email}</p>}
                        {student.phone && <p>📱 {student.phone}</p>}
                        {student.error && <p className="text-red-600">❌ {student.error}</p>}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 text-right">
                      <div>
                        <p className="text-sm text-muted-foreground">الرصيد</p>
                        <p className={`font-bold ${student.totalBalance > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                          {formatCurrency(student.totalBalance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">المديونية</p>
                        <p className={`font-bold ${student.totalOwed > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                          {formatCurrency(student.totalOwed)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">الصافي</p>
                        <p className={`font-bold ${
                          student.totalBalance - student.totalOwed >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(student.totalBalance - student.totalOwed)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {includeDetails && student.balances && (
                    <div className="mt-4 pt-4 border-t">
                      <details className="cursor-pointer">
                        <summary className="font-medium text-sm mb-2">تفاصيل الأرصدة والرسوم</summary>
                        <div className="bg-gray-50 p-3 rounded text-xs">
                          <pre className="whitespace-pre-wrap overflow-x-auto">
                            {JSON.stringify(student.balances, null, 2)}
                          </pre>
                          {student.serviceCharges && student.serviceCharges.length > 0 && (
                            <div className="mt-2">
                              <p className="font-medium mb-1">رسوم الخدمات:</p>
                              <pre className="whitespace-pre-wrap overflow-x-auto">
                                {JSON.stringify(student.serviceCharges, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </details>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'لم يتم العثور على نتائج للبحث' : 'لا توجد بيانات للعرض'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
