'use client'

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
  
  console.log('📋 ReceiptTable component rendering with data:', data)
  console.log('📊 Data length:', data?.length || 0)
  
  // Handle empty data
  if (!data || data.length === 0) {
    console.log('⚠️ No receipts data available')
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">إيصالات اليوم</h2>
          <span className="text-sm text-muted-foreground">
            إجمالي الإيصالات: 0
          </span>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <p>لا توجد إيصالات ليوم اليوم</p>
        </div>
      </div>
    )
  }
  
  const columns: ColumnDef<IReceipt>[] = [
    {
      accessorKey: 'receiptNumber',
      header: 'رقم الإيصال',
    },
    {
      accessorKey: 'studentName',
      header: t('student'),
    },
    {
      accessorKey: 'amount',
      header: t('amountPaid'),
      cell: ({ row }) => {
        const amount = row.getValue('amount') as number
        return <span className="font-medium">{amount?.toLocaleString()} ريال</span>
      },
    },
    {
      accessorKey: 'serviceType',
      header: t('receiptType'),
    },
    {
      accessorKey: 'description',
      header: t('description'),
    },
    {
      accessorKey: 'date',
      header: 'التاريخ',
      cell: ({ row }) => {
        const date = row.getValue('date') as string
        return <span>{new Date(date).toLocaleDateString('ar-SA')}</span>
      },
    },
    {
      accessorKey: 'createdBy',
      header: 'أنشأ بواسطة',
    },
  ]
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">إيصالات اليوم</h2>
        <span className="text-sm text-muted-foreground">
          إجمالي الإيصالات: {data.length}
        </span>
      </div>
      <AppTable
        title=""
        columns={columns}
        data={data}
        mainRoute={routes.receipts}
        hideHeaders={false}
      />
    </div>
  )
}
