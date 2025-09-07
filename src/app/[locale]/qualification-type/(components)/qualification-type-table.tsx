'use client'
import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/const/routes.enum'
import { TableInputFilter } from '@/components/table/table-input-filter'
import { AppTable } from '@/components/table/app-table'
import { IQualificationType } from './qualification-type.interface'

type Props = {
  data: IQualificationType[]
}

export const QualificationTypeTable = ({ data }: Props) => {
  const t = useTranslations('qualificationType')
  const columns: ColumnDef<IQualificationType>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
    },
  ]
  return (
    <AppTable
      title={t('title')}
      columns={columns}
      data={data}
      mainRoute={routes.qualificationType}
    />
  )
}
