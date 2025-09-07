import { useTranslations } from 'next-intl'
import { ICourse } from './course.interface'
import { ColumnDef } from '@tanstack/react-table'

export const useCourseColumn = () => {
  const t = useTranslations('course')
  const columns: ColumnDef<ICourse>[] = [
    {
      accessorKey: 'name',
      header: t('name', { default: 'Name' }),
    },

    {
      accessorKey: 'categoryName',
      header: t('categoryId', { default: 'Category' }),
    },
    {
      accessorKey: 'levels',
      header: t('levels', { default: 'Levels' }),
      cell: ({ row }) => {
        return <div>{row.original?.levels?.length ?? 0}</div>
      },
    },
    {
      accessorKey: 'price',
      header: t('price', { default: 'Price' }),
      cell: ({ row }) => {
        return (
          <div>{row.original?.levels?.reduce((acc, level) => acc + (level.price ?? 0), 0)}</div>
        )
      },
    },
    {
      accessorKey: 'sessionsCount',
      header: t('sessionsCount', { default: 'Sessions Count' }),
      cell: ({ row }) => {
        return (
          <div>
            {row.original?.levels?.reduce((acc, level) => acc + (level.sessionsCount ?? 0), 0)}
          </div>
        )
      },
    },
  ]
  return columns
}
