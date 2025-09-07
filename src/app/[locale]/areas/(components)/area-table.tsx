'use client'
import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/const/routes.enum'
import { TableInputFilter } from '@/components/table/table-input-filter'
import { AppTable } from '@/components/table/app-table'
import { IArea } from './area.interface'

type Props = {
  data: IArea[]
}

export const AreaTable = ({ data }: Props) => {
  const t = useTranslations('area')
  const columns: ColumnDef<IArea>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
    },
    {
      accessorKey: 'cityName',
      header: t('cityId'),
    },
  ]
  return <AppTable title={t('title')} columns={columns} data={data} mainRoute={routes.areas} />
}
