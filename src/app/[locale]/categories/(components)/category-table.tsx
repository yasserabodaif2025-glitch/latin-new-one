'use client'

import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/const/routes.enum'
import { AppTable } from '@/components/table/app-table'
import { ICategory } from './category.interface'

type Props = {
  data: ICategory[]
}

export const CategoryTable = ({ data }: Props) => {
  const t = useTranslations('category')
  const columns: ColumnDef<ICategory>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
    },
    {
      accessorKey: 'description',
      header: t('description'),
    },
  ]
  return <AppTable title={t('title')} columns={columns} data={data} mainRoute={routes.categories} />
}
