'use client'
import { AppTable } from '@/components/table'
import { ColumnDef, RowSelectionState, Updater } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import React from 'react'
import { Input } from '@/components/ui/input'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { LectureSchema, SessionStudentSchema } from '@/lib/schema'

interface Props {
  data: SessionStudentSchema[]
  selected?: Record<string, boolean>
  setSelected?: (row: Updater<RowSelectionState>) => void
}

export const AttendsFormTable = ({ data, selected, setSelected }: Props) => {
  const { control } = useFormContext<LectureSchema>()

  const { fields, update } = useFieldArray({
    control,
    name: 'sessionStudents',
  })

  const t = useTranslations('lecture')
  const columns: ColumnDef<SessionStudentSchema>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
    },
    {
      accessorKey: 'phone',
      header: t('phone'),
    },
    {
      accessorKey: 'notes',
      header: t('notes'),
      cell: ({ row }) => {
        const field = fields.find((field) => +field.studentId === +row.original.studentId)
        return (
          <Input
            type="text"
            defaultValue={field?.notes}
            onBlur={(e) => {
              update(row.index, {
                studentId: row.original.studentId,
                isPresent: row.original.isPresent,
                notes: e.target.value,
                name: row.original.name,
                phone: row.original.phone,
              })
            }}
          />
        )
      },
    },
  ]

  return (
    <AppTable
      title={t('title')}
      columns={columns}
      data={data}
      showActions={false}
      hideHeaders
      onRowSelected={setSelected}
      selectedRows={selected}
      showSelect
    />
  )
}
