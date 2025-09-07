'use client'
import React from 'react'
import { AppTable } from '@/components/table/app-table'
import { ColumnDef } from '@tanstack/react-table'
import { TableInputFilter } from '@/components/table/table-input-filter'
import { useTranslations } from 'next-intl'
import { ICourseGroup } from './course-group.interface'
import { routes } from '@/lib/const/routes.enum'
import { formatToAmPm } from '@/lib/formatToAmPm'

type Props = {
  data: ICourseGroup[]
}

export const CourseGroupTable = ({ data }: Props) => {
  const t = useTranslations('courseGroup')
  const columns: ColumnDef<ICourseGroup>[] = [
    {
      accessorKey: 'applicationId',
      header: t('code'),
    },
    {
      accessorKey: 'name',
      header: t('name'),
    },
    {
      accessorKey: 'startDate',
      header: t('startDate'),
      cell: ({ row }) => {
        return new Date(row?.original?.startDate).toDateString()
      },
    },
    {
      accessorKey: 'endDate',
      header: t('endDate'),
      cell: ({ row }) => new Date(row?.original?.endDate).toDateString(),
    },
    {
      accessorKey: 'statusName',
      header: t('status'),
    },
    {
      accessorKey: 'instructorName',
      header: t('lecturer'),
    },
    {
      accessorKey: 'levelName',
      header: t('level'),
    },
    {
      accessorKey: 'roomName',
      header: t('lab'),
    },
    {
      accessorKey: 'days',
      header: t('days'),
    },
    {
      accessorKey: 'startTime',
      header: t('startTime'),
      cell: ({ row }) => formatToAmPm(row?.original?.startTime),
    },
    {
      accessorKey: 'endTime',
      header: t('endTime'),
      cell: ({ row }) => formatToAmPm(row?.original?.endTime),
    },
  ]
  return (
    <AppTable title={t('title')} columns={columns} data={data} mainRoute={routes.courseGroups} />
  )
}
