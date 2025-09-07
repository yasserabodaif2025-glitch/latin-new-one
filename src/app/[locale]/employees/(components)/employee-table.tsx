'use client'
import React, { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/const/routes.enum'
import { AppTable } from '@/components/table/app-table'
import { IEmployee } from './employee.interface'
import { UserPermissionsManager } from '@/components/permissions/user-permissions-manager'

type Props = {
  data: IEmployee[]
}

export const EmployeeTable = ({ data }: Props) => {
  const t = useTranslations('employee')
  const tAny = t as unknown as (k: any) => string
  
  const columns: ColumnDef<IEmployee>[] = useMemo(() => [
    {
      accessorKey: 'name',
      header: t('name'),
    },
    {
      accessorKey: 'email',
      header: t('email'),
    },
    {
      accessorKey: 'phone',
      header: t('phone'),
    },
    {
      accessorKey: 'department',
      header: t('department'),
    },
    {
      accessorKey: 'jobTitle',
      header: t('jobTitle'),
    },
    {
      accessorKey: 'status',
      header: t('status'),
      cell: ({ row }) => {
        const s = row.original.status
        switch (s) {
          case 'ACTIVE':
            return tAny('statusACTIVE')
          case 'SUSPENDED':
            return tAny('statusSUSPENDED')
          case 'TRAINING':
            return tAny('statusTRAINING')
          case 'TERMINATED':
            return tAny('statusTERMINATED')
          default:
            return tAny('status')
        }
      },
    },
    {
      accessorKey: 'salary',
      header: t('salary'),
    },
    {
      accessorKey: 'educationalQualificationId',
      header: t('educationalQualification'),
      cell: ({ row }) => row.original.educationalQualificationName || '',
    },
    {
      id: 'permissions',
      header: 'الصلاحيات',
      cell: ({ row }) => (
        <UserPermissionsManager 
          employee={{
            id: row.original.id,
            name: row.original.name,
            email: row.original.email,
            roleId: row.original.roleId
          }}
        />
      ),
    },
  ], [t, tAny])
  
  return <AppTable title={t('title')} columns={columns} data={data} mainRoute={routes.employees} />
}
