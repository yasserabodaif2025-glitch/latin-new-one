'use client'
import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/const/routes.enum'
import { AppTable } from '@/components/table/app-table'
import { IQualificationDescription } from './qualification-description.interface'

type Props = {
  data: IQualificationDescription[]
}

export const QualificationDescriptionTable = ({ data }: Props) => {
  const t = useTranslations('qualificationDescription')
  const columns: ColumnDef<IQualificationDescription>[] = [
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
      mainRoute={routes.qualificationDescription}
    />
  )
}
