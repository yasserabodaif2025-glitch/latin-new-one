import { useTranslations } from 'next-intl'
import { ICourseGroup } from './course-group.interface'
import { ColumnDef } from '@tanstack/react-table'
import { formatToAmPm } from '@/lib/formatToAmPm'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Book, User, Calendar, Clock, DollarSign, Layers, MapPin } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const statusColorMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Active: 'default',
  Inactive: 'secondary',
  Closed: 'destructive',
  Pending: 'outline',
}

export const useCourseGroupColumn = () => {
  const t = useTranslations('courseGroup')

  const columns: ColumnDef<ICourseGroup>[] = [
    {
      accessorKey: 'applicationId',
      header: t('code'),
      cell: ({ row }) => (
        <span className="font-bold text-primary">{row.original.applicationId}</span>
      ),
    },
    {
      accessorKey: 'name',
      header: t('name'),
      cell: ({ row }) => <span className="font-bold">{row.original.name}</span>,
    },
    {
      accessorKey: 'startDate',
      header: t('startDate'),
      cell: ({ row }) => (
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4 text-blue-500" />
          {new Date(row.original.startDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: 'endDate',
      header: t('endDate'),
      cell: ({ row }) => (
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4 text-pink-500" />
          {new Date(row.original.endDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: 'statusName',
      header: t('status'),
      cell: ({ row }) => {
        const statusName = (row.original as any).statusName || ''
        return <Badge variant={statusColorMap[statusName] || 'secondary'}>{statusName}</Badge>
      },
    },
    {
      accessorKey: 'instructorName',
      header: t('lecturer'),
      cell: ({ row }) => (
        <span className="flex items-center gap-1 font-medium">
          <User className="h-4 w-4 text-gray-500" />
          {row.original.instructorName}
        </span>
      ),
    },
    {
      accessorKey: 'levelName',
      header: t('level'),
      cell: ({ row }) => <span className="">{row.original.levelName}</span>,
    },
    {
      accessorKey: 'price',
      header: t('price'),
      cell: ({ row }) => <span className="font-bold text-emerald-700">{row.original.price}</span>,
    },
    {
      accessorKey: 'roomName',
      header: t('lab'),
      cell: ({ row }) => (
        <span className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-orange-500" />
          {row.original.roomName}
        </span>
      ),
    },
    {
      accessorKey: 'days',
      header: t('days'),
      cell: ({ row }) => {
        // Accepts either array or string (e.g., 'Saturday, Monday, Wednesday')
        let daysArr: string[] = []
        if (Array.isArray(row.original.days)) {
          daysArr = row.original.days.map((d) => d.toString())
        } else if (typeof row.original.days === 'string') {
          daysArr = row.original.days.split(',').map((d) => d.trim())
        }
        const shortDays = daysArr.slice(0, 3).map((d, i) => (
          <span key={i} className="mx-0.5 rounded bg-muted px-1 text-xs font-semibold">
            {d.slice(0, 2)}
          </span>
        ))
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex cursor-pointer items-center gap-1">
                  {shortDays}
                  {daysArr.length > 3 && (
                    <span className="text-xs text-gray-400">+{daysArr.length - 3}</span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-wrap gap-1">
                  {daysArr.map((d, i) => (
                    <span key={i} className="rounded bg-muted px-1 text-xs font-semibold">
                      {d}
                    </span>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: 'startTime',
      header: t('startTime'),
      cell: ({ row }) => (
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-blue-400" />
          {formatToAmPm(row.original.startTime)}
        </span>
      ),
    },
    {
      accessorKey: 'endTime',
      header: t('endTime'),
      cell: ({ row }) => (
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-red-400" />
          {formatToAmPm(row.original.endTime)}
        </span>
      ),
    },
  ]

  return columns
}
