import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Safe {
  id: number
  name: string
  employee: { name: string }
  balance: number
}

const deleteSafe = (id: number) => {
  console.log('delete safe', id)
}

const columns: ColumnDef<Safe>[] = [
  {
    accessorKey: 'name',
    header: 'الاسم',
  },
  {
    accessorKey: 'employee.name',
    header: 'الموظف',
  },
  {
    accessorKey: 'balance',
    header: 'الرصيد',
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link href={`/safes/${row.original.id}`}>
          <Button variant="outline" size="sm">تعديل</Button>
        </Link>
        <Button variant="destructive" size="sm" onClick={() => deleteSafe(row.original.id)}>حذف</Button>
      </div>
    ),
  },
]

export default function SafeTable({ safes }: { safes: Safe[] }) {
  return <DataTable columns={columns} data={safes} />
}
