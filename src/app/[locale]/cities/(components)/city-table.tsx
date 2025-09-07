'use client'
import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/const/routes.enum'
import { TableInputFilter } from '@/components/table/table-input-filter'
import { AppTable } from '@/components/table/app-table'
import { ICity } from './city.interface'

type Props = {
  data: ICity[]
}

export const CityTable = ({ data }: Props) => {
  const t = useTranslations('city')
  const columns: ColumnDef<ICity>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
    },
  ]
  return <AppTable title={t('title')} columns={columns} data={data} mainRoute={routes.cities} />
}
