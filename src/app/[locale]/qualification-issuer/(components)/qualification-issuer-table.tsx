'use client'
import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/const/routes.enum'
import { TableInputFilter } from '@/components/table/table-input-filter'
import { AppTable } from '@/components/table/app-table'
import { IQualificationIssuer } from './qualification-issuer.interface'

type Props = {
  data: IQualificationIssuer[]
}

export const QualificationIssuerTable = ({ data }: Props) => {
  const t = useTranslations('qualificationIssuer')
  const columns: ColumnDef<IQualificationIssuer>[] = [
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
      mainRoute={routes.qualificationIssuer}
    />
  )
}
