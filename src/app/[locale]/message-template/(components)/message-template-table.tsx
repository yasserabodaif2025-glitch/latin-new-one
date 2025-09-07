'use client'
import React from 'react'
import { AppTable } from '@/components/table/app-table'
import { ColumnDef } from '@tanstack/react-table'
import { TableInputFilter } from '@/components/table/table-input-filter'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/const/routes.enum'
import { IMessageTemplate } from './message-template.interface'
import { Check, X } from 'lucide-react'

interface Props {
  data: IMessageTemplate[]
}

export const MessageTemplateTable = ({ data }: Props) => {
  const t = useTranslations('messageTemplate')
  const columns: ColumnDef<IMessageTemplate>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
    },
    {
      accessorKey: 'body',
      header: t('message'),
    },
    {
      accessorKey: 'trigger',
      header: t('trigger'),
    },
    {
      accessorKey: 'sendAutomatically',
      header: t('sendAutomatically'),
      cell: ({ row }) => {
        return row.original.sendAutomatically ? (
          <Check className="text-green-500" />
        ) : (
          <X className="text-red-500" />
        )
      },
    },
    {
      accessorKey: 'courseName',
      header: t('course'),
    },
  ]
  return (
    <AppTable
      title={t('title')}
      columns={columns}
      data={data}
      showActions
      mainRoute={routes.messageTemplate}
    />
  )
}
