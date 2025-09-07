'use client'
import React from 'react'
import { AppTable } from '@/components/table/app-table'
import { ColumnDef } from '@tanstack/react-table'
import { TableInputFilter } from '@/components/table/table-input-filter'
import { routes } from '@/lib/const/routes.enum'
import { useTranslations } from 'next-intl'
import { IStudent } from './student.interface'

type Props = {
  data: IStudent[]
}

export const StudentTable = ({ data }: Props) => {
  const t = useTranslations('student')
  const columns: ColumnDef<IStudent>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
    },
    {
      accessorKey: 'email',
      header: t('email'),
      cell: ({ row }) => {
        return <a href={`mailto:${row.original.email}`}>{row.original.email}</a>
      },
    },
    {
      accessorKey: 'phone',
      header: t('phone'),
      cell: ({ row }) => {
        return <a href={`tel:${row.original.phone}`}>{row.original.phone}</a>
      },
    },
    {
      accessorKey: 'address',
      header: t('address'),
    },
  ]
  return <AppTable title={t('title')} columns={columns} data={data} mainRoute={routes.students} />
}
