'use client'
import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/const/routes.enum'
import { TableInputFilter } from '@/components/table/table-input-filter'
import { AppTable } from '@/components/table/app-table'
import { ILab } from './lab.interface'

type Props = {
  data: ILab[]
}

export const LabTable = ({ data }: Props) => {
  const t = useTranslations('lab')
  const columns: ColumnDef<ILab>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
    },
    {
      accessorKey: 'branchName',
      header: t('branch'),
    },
    {
      accessorKey: 'type',
      header: t('type'),
    },
    {
      accessorKey: 'capacity',
      header: t('capacity'),
    },
  ]
  return <AppTable title={t('title')} columns={columns} data={data} mainRoute={routes.labs} />
}
