'use client'

import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/const/routes.enum'
import { TableInputFilter } from '@/components/table/table-input-filter'
import { AppTable } from '@/components/table/app-table'
import { IBranch } from '.'

type Props = {
  data: IBranch[]
}

// header: ({ column }) => {
//   return <TableInputFilter column={column} header={t('name')} accessorKey="name" />
// },
// cell: ({ row }) => {
//   return <div className="px-5">{row.original.name}</div>
// },
// enableSorting: true,
// enableGlobalFilter: true,

export const BranchTable = ({ data }: Props) => {
  const t = useTranslations('branch')
  const columns: ColumnDef<IBranch>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
    },
    {
      accessorKey: 'areaName',
      header: t('areaId'),
    },
    {
      accessorKey: 'address',
      header: t('address'),
    },
  ]
  return <AppTable title={t('title')} columns={columns} data={data} mainRoute={routes.branches} />
}
