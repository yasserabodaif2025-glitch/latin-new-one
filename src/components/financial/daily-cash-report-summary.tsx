'use client'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale/ar'
import { enUS } from 'date-fns/locale'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { DatePicker } from '@/components/ui/date-picker'
import { useState } from 'react'
import { getDailyCashReportSummary } from '@/lib/api/financial.service'

type DailyCashReportSummary = {
  date: string
  totalIncome: number
  totalExpenses: number
  openingBalance: number
  closingBalance: number
  status: 'open' | 'closed'
}

export function DailyCashReportSummary() {
  const t = useTranslations('financial')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data, isLoading, error, refetch } = useQuery<DailyCashReportSummary>({
    queryKey: ['daily-cash-report', selectedDate.toISOString().split('T')[0]],
    queryFn: () => getDailyCashReportSummary(selectedDate.toISOString().split('T')[0]),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      await refetch()
    } finally {
      setIsRefreshing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateStr: string): string => {
    try {
      return format(new Date(dateStr), 'PPP', {
        locale: document.documentElement.lang === 'ar' ? ar : enUS,
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      return dateStr // Return the original string if date parsing fails
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('errorLoadingReport')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {t('retry')}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {t('dailyCashReport')}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <DatePicker
            selected={selectedDate}
            onSelect={(date: Date | undefined) => date && setSelectedDate(date)}
            className="w-[150px]"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">{t('date')}:</span>
            <span className="font-medium">
              {data ? formatDate(data.date) : '--'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              {t('openingBalance')}:
            </span>
            <span className="font-medium">
              {data ? formatCurrency(data.openingBalance) : '--'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              {t('totalIncome')}:
            </span>
            <span className="font-medium text-green-600">
              {data ? `+${formatCurrency(data.totalIncome)}` : '--'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              {t('totalExpenses')}:
            </span>
            <span className="font-medium text-red-600">
              {data ? `-${formatCurrency(data.totalExpenses)}` : '--'}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2 font-semibold">
            <span className="text-sm">{t('closingBalance')}:</span>
                        <span className={data && data.closingBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
              {data ? formatCurrency(data.closingBalance) : '--'}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-muted-foreground">{t('status.label')}:</span>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                data?.status === 'closed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {data ? t(`status.${data.status}`) : '--'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
