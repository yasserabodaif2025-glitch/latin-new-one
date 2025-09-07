'use client'
import React from 'react'
import { AppTable } from '@/components/table/app-table'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { ILecturer } from './lecturer.interface'
import { routes } from '@/lib/const/routes.enum'

type Props = {
  data: ILecturer[]
}

export const LecturerTable = ({ data }: Props) => {
  const t = useTranslations('lecturer')

  const columns: ColumnDef<ILecturer>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
    },
    {
      accessorKey: 'email',
      header: t('email'),
      cell: ({ row }) => <a href={`mailto:${row.original.email}`}>{row.original.email}</a>,
    },
    {
      accessorKey: 'phone',
      header: t('phone'),
      cell: ({ row }) => <a href={`tel:${row.original.phone}`}>{row.original.phone}</a>,
    },
    {
      accessorKey: 'cityName',
      header: t('city'),
    },
    {
      accessorKey: 'salary',
      header: t('salary'),
    },
    {
      accessorKey: 'salaryTypeName',
      header: t('salaryType'),
    },
  ]

  return <AppTable title={t('title')} columns={columns} data={data} mainRoute={routes.lecturers} />
}
