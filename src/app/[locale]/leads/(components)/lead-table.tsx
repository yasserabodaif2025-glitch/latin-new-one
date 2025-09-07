'use client'
import React from 'react'
import { AppTable } from '@/components/table/app-table'
import { ColumnDef } from '@tanstack/react-table'
import { routes } from '@/lib/const/routes.enum'
import { useTranslations } from 'next-intl'

type Props = {
  data: any[]
}

export const LeadTable = ({ data }: Props) => {
  const t = useTranslations('lead')
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
    },
    {
      accessorKey: 'email',
      header: t('email'),
    },
    {
      accessorKey: 'phone',
      header: t('phone'),
    },
    {
      accessorKey: 'courseName',
      header: t('courseId'),
    },
  ]
  return <AppTable title={t('title')} columns={columns} data={data} mainRoute={routes.leads} />
}
