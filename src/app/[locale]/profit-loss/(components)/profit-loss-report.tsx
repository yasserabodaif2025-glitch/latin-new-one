'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, DollarSign, Receipt, CreditCard, Calendar } from 'lucide-react'
import { getProfitLossReport, type ProfitLossData } from '../profit-loss.action'

const formatEGP = (amount: number | undefined | null) => {
  const numAmount = Number(amount) || 0
  if (isNaN(numAmount)) return '0.00 ج.م'
  
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 2
  }).format(numAmount)
}

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}

export default function ProfitLossReport() {
  const [data, setData] = useState<ProfitLossData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [startDate, setStartDate] = useState(() => {
    const date = new Date()
    date.setDate(1) // أول الشهر الحالي
    return formatDate(date)
  })
  const [endDate, setEndDate] = useState(() => formatDate(new Date()))

  const loadReport = async () => {
    try {
      setIsLoading(true)
      const result = await getProfitLossReport(startDate, endDate)
      setData(result)
    } catch (error) {
      console.error('فشل في جلب التقرير:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadReport()
  }, [])

  const handleFilter = () => {
    loadReport()
  }

  const profitPercentage = data?.totalIncome && data.totalIncome > 0 
    ? ((Number(data.netProfit) / Number(data.totalIncome)) * 100) 
    : 0

  return (
    <div className="space-y-4">
      {/* فلاتر التاريخ */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            فلترة التقرير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 items-end">
            <div className="space-y-1">
              <Label className="text-xs">من تاريخ</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8 text-xs w-40"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">إلى تاريخ</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8 text-xs w-40"
              />
            </div>
            <Button onClick={handleFilter} disabled={isLoading} className="h-8 text-xs">
              {isLoading ? 'جاري التحميل...' : 'عرض التقرير'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <>
          {/* ملخص سريع */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">إجمالي الدخل</p>
                    <p className="text-lg font-bold text-green-600">{formatEGP(Number(data.totalIncome) || 0)}</p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">إجمالي المصروفات</p>
                    <p className="text-lg font-bold text-red-600">{formatEGP(Number(data.totalExpenses) || 0)}</p>
                  </div>
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">صافي الربح/الخسارة</p>
                    <p className={`text-lg font-bold ${Number(data.netProfit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatEGP(Number(data.netProfit) || 0)}
                    </p>
                  </div>
                  <DollarSign className={`h-6 w-6 ${data.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">هامش الربح</p>
                    <p className={`text-lg font-bold ${profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {(Number(profitPercentage) || 0).toFixed(1)}%
                    </p>
                  </div>
                  <Badge variant={profitPercentage >= 0 ? 'default' : 'destructive'} className="text-xs">
                    {profitPercentage >= 0 ? 'ربح' : 'خسارة'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* تفصيل الدخل والمصروفات */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* تفصيل الدخل */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Receipt className="h-4 w-4 text-green-600" />
                  تفصيل الدخل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs">مدفوعات الطلاب</span>
                  <span className="font-medium text-green-600">{formatEGP(Number(data.incomeBreakdown.studentPayments) || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">رسوم الخدمات</span>
                  <span className="font-medium text-green-600">{formatEGP(Number(data.incomeBreakdown.serviceCharges) || 0)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-sm">الإجمالي</span>
                    <span className="text-green-600">{formatEGP(Number(data.totalIncome) || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* تفصيل المصروفات */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-red-600" />
                  تفصيل المصروفات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs">مصروفات تشغيلية</span>
                  <span className="font-medium text-red-600">{formatEGP(Number(data.expenseBreakdown.operational) || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">رواتب</span>
                  <span className="font-medium text-red-600">{formatEGP(Number(data.expenseBreakdown.salaries) || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">مرافق</span>
                  <span className="font-medium text-red-600">{formatEGP(Number(data.expenseBreakdown.utilities) || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">أخرى</span>
                  <span className="font-medium text-red-600">{formatEGP(Number(data.expenseBreakdown.other) || 0)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-sm">الإجمالي</span>
                    <span className="text-red-600">{formatEGP(Number(data.totalExpenses) || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ملخص نهائي */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-center text-sm">ملخص الربح والخسارة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span>إجمالي الدخل:</span>
                  <span className="font-medium text-green-600">{formatEGP(Number(data.totalIncome) || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>إجمالي المصروفات:</span>
                  <span className="font-medium text-red-600">({formatEGP(Number(data.totalExpenses) || 0)})</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>صافي {Number(data.netProfit) >= 0 ? 'الربح' : 'الخسارة'}:</span>
                    <span className={Number(data.netProfit) >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatEGP(Math.abs(Number(data.netProfit) || 0))}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {isLoading && (
        <div className="text-center py-8 text-sm text-gray-500">
          جاري تحميل التقرير...
        </div>
      )}
    </div>
  )
}