'use client'
import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/const/routes.enum'
import { TableInputFilter } from '@/components/table/table-input-filter'
import { AppTable } from '@/components/table/app-table'
import { ICampaign } from './campaign.interface'
import { Eye } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import Link from 'next/link'

type Props = {
  data: ICampaign[]
}

export const CampaignTable = ({ data }: Props) => {
  const t = useTranslations('campaign')
  const columns: ColumnDef<ICampaign>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
    },
    {
      accessorKey: 'description',
      header: t('description'),
      cell: ({ row }) => {
        return <div className="px-5">{row.original.description}</div>
      },
    },
    {
      accessorKey: 'startDate',
      header: t('startDate'),
      cell: ({ row }) => {
        return <div className="px-5">{row.original.startDate}</div>
      },
    },
    {
      accessorKey: 'endDate',
      header: t('endDate'),
      cell: ({ row }) => {
        return <div className="px-5">{row.original.endDate}</div>
      },
    },
    // {
    //   accessorKey: 'status',
    //   header: t('status'),
    //   cell: ({ row }) => {
    //     return <div className="px-5">{row.original.status}</div>
    //   },
    // },
  ]

  const extraActions = (item: ICampaign) => {
    return (
      <DropdownMenuItem>
        <Link
          className="flex w-full items-center justify-between"
          href={`/${routes.campaigns}/form/${item.referenceId}`}
        >
          <span>{t('viewForm')}</span>
          <Eye className="size-4" />
        </Link>
      </DropdownMenuItem>
    )
  }
  return (
    <AppTable
      title={t('title')}
      columns={columns}
      data={data}
      mainRoute={routes.campaigns}
      extraActions={extraActions}
    />
  )
}
