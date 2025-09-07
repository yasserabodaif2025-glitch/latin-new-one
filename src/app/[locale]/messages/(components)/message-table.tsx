'use client'
import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/const/routes.enum'
import { TableInputFilter } from '@/components/table/table-input-filter'
import { AppTable } from '@/components/table/app-table'
import { IMessage } from './message.interface'

type Props = {
  data: IMessage[]
}

export const MessageTable = ({ data }: Props) => {
  const t = useTranslations('message')
  const columns: ColumnDef<IMessage>[] = [
    {
      accessorKey: 'phone',
      header: ({ column }) => {
        return <TableInputFilter column={column} header={t('phone')} accessorKey="phone" />
      },
      cell: ({ row }) => {
        return <div className="px-5">{row.original.phone}</div>
      },
      enableSorting: true,
      enableGlobalFilter: true,
    },
    {
      accessorKey: 'message',
      header: t('message'),
      cell: ({ row }) => {
        return <div className="px-5">{row.original.message}</div>
      },
    },
  ]
  return <AppTable title={t('title')} columns={columns} data={data} mainRoute={routes.messages} />
}
