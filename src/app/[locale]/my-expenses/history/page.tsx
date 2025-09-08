import { useTranslations } from 'next-intl'
import { ExpenseHistoryTable } from './(components)/expense-history-table'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MyExpensesHistoryPage({
  searchParams,
}: {
  searchParams: { from?: string; to?: string }
}) {
  const t = useTranslations('expense')
  const { from, to } = searchParams

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{t('expenseHistory')}</h1>
        <p className="text-muted-foreground">
          {t('viewAndFilterExpenseHistory')}
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('filterByDate')}</CardTitle>
          <div className="flex items-center space-x-2">
            <DateRangePicker
              from={from ? new Date(from) : null}
              to={to ? new Date(to) : null}
              placeholder={t('selectDateRange')}
              className="w-[300px]"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ExpenseHistoryTable from={from} to={to} />
        </CardContent>
      </Card>
    </div>
  )
}
