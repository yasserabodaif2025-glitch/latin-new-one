import { ColumnDef } from '@tanstack/react-table'
import { Role } from '@/lib/api/roles.service'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const columns = (
  onEdit: (role: Role) => void,
  onDelete: (id: number) => void,
  onManagePermissions: (role: Role) => void
): ColumnDef<Role>[] => [
  {
    accessorKey: 'name',
    header: 'الاسم',
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: 'description',
    header: 'الوصف',
    cell: ({ row }) => row.original.description || '-',
  },
  {
    accessorKey: 'isActive',
    header: 'الحالة',
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? 'default' : 'outline'}>
        {row.original.isActive ? 'نشط' : 'غير نشط'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(row.original)} title="تعديل">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onManagePermissions(row.original)}
          title="إدارة الصلاحيات"
        >
          <Lock className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row.original.id)}
          title="حذف"
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]
