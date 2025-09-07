import { TrashIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { IStudent } from '../../students/(components)/student.interface'

type Props = {
  data: IStudent[]
  onDelete: (id: number) => void
  disabled?: boolean
}

export const GroupStudentsTable = ({ data, onDelete, disabled }: Props) => {
  const t = useTranslations('student')
  const tTable = useTranslations('table')

  if (data.length === 0) {
    return <div className="py-4 text-center">{tTable('noResults')}</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('applicationId')}</TableHead>
          <TableHead>{t('name')}</TableHead>
          <TableHead>{t('phone')}</TableHead>
          <TableHead>{t('email')}</TableHead>
          <TableHead>{t('actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((student) => (
          <TableRow key={student.id}>
            <TableCell>{student.applicationId}</TableCell>
            <TableCell>{student.name}</TableCell>
            <TableCell>{student.phone}</TableCell>
            <TableCell>{student.email}</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onDelete(student.id)}
                disabled={disabled}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
