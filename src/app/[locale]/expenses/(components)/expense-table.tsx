import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/const/routes.enum'
import { AppTable } from '@/components/table/app-table'
import { IExpense } from './expense.interface'

type Props = {
  data: IExpense[]
}

export const ExpenseTable = ({ data }: Props) => {
  const t = useTranslations('expense')
  const columns: ColumnDef<IExpense>[] = [
    {
      accessorKey: 'fromSafeId',
      header: t('fromSafeId'),
    },
    {
      accessorKey: 'accountCode',
      header: t('accountCode'),
    },
    {
      accessorKey: 'amount',
      header: t('amount'),
    },
    {
      accessorKey: 'description',
      header: t('description'),
    },
    {
      accessorKey: 'expenseDate',
      header: t('expenseDate'),
    },
  ]
  return (
    <AppTable
      title={t('title')}
      columns={columns}
      data={data}
      mainRoute={routes.expenses}
      hideHeaders
    />
  )
}
