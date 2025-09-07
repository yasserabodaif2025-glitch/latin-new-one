'use client'
import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/const/routes.enum'
import { TableInputFilter } from '@/components/table/table-input-filter'
import { AppTable } from '@/components/table/app-table'
import { IAgreement } from './agreement.interface'

type Props = {
  data: IAgreement[]
}

export const AgreementTable = ({ data }: Props) => {
  const t = useTranslations('agreement')
  const columns: ColumnDef<IAgreement>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
    },
  ]
  return <AppTable title={t('title')} columns={columns} data={data} mainRoute={routes.agreements} />
}
