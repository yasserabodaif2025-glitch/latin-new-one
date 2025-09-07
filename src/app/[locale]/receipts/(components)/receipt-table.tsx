import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/const/routes.enum'
import { AppTable } from '@/components/table/app-table'
import { IReceipt } from './receipt.interface'

type Props = {
  data: IReceipt[]
}

export const ReceiptTable = ({ data }: Props) => {
  const t = useTranslations('receipt')
  const columns: ColumnDef<IReceipt>[] = [
    {
      accessorKey: 'studentName',
      header: t('student'),
    },
    {
      accessorKey: 'amount',
      header: t('amountPaid'),
    },
    {
      accessorKey: 'description',
      header: t('description'),
    },
    {
      accessorKey: 'enrollment',
      header: t('enrollment'),
    },
    {
      accessorKey: 'serviceType',
      header: t('receiptType'),
    },
  ]
  return (
    <AppTable
      title={t('title')}
      columns={columns}
      data={data}
      mainRoute={routes.receipts}
      hideHeaders
    />
  )
}
