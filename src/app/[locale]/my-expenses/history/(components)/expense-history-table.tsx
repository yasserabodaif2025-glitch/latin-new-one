'use client'

import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale/ar'
import { enUS } from 'date-fns/locale/en-US'
import { useState } from 'react'
import { getMyExpenses } from '@/lib/api/financial.service'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import { ExpenseDto, ExpensePaginationResult, ExpenseQueryParams } from '@/types/financial.types'

type Expense = ExpenseDto

export function ExpenseHistoryTable({ from, to }: { from?: string; to?: string }) {
  const t = useTranslations('expense')
  const [sortField, setSortField] = useState<ExpenseQueryParams['sortBy']>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data, isLoading, error } = useQuery<ExpensePaginationResult>({
    queryKey: ['my-expenses', { fromDate: from, toDate: to, sortBy: sortField, sortOrder, page, pageSize }],
    queryFn: () => getMyExpenses({ fromDate: from, toDate: to, sortBy: sortField, sortOrder, page, pageSize }),
  })

  const handleSort = (field: ExpenseQueryParams['sortBy']) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }


  const SortableHeader = ({ field, children }: { field: ExpenseQueryParams['sortBy']; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-accent"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {children}
        {sortField === field && (
          <span className="ml-1">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </TableHead>
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        {t('errorLoadingExpenses')}
      </div>
    )
  }

  if (!data?.items?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('noExpensesFound')}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader field="createdAt">
                {t('date')}
              </SortableHeader>
              <TableHead>{t('description')}</TableHead>
              <TableHead>{t('category')}</TableHead>
              <SortableHeader field="amount">
                {t('amount')}
              </SortableHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((expense: Expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  {format(new Date(expense.createdAt), 'dd/MM/yyyy', {
                    locale: document.documentElement.lang === 'ar' ? ar : enUS,
                  })}
                </TableCell>
                <TableCell className="font-medium">
                  {expense.description}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {expense.accountCode || t('uncategorized')}
                  </span>
                </TableCell>
                <TableCell className="font-medium text-right">
                  {formatCurrency(expense.amount, 'EGP')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          {t('showingResults', {
            from: (page - 1) * pageSize + 1,
            to: Math.min(page * pageSize, data.total),
            total: data.total,
          })}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            {t('previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={!data.hasMore}
          >
            {t('next')}
          </Button>
        </div>
      </div>
    </div>
  )
}
