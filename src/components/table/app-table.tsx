'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  Updater,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, Edit, Eye, MoreHorizontal, Plus, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { usePathname, Link } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import { routes } from '@/lib/const/routes.enum'

const defaultColumns: ColumnDef<any>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center px-2">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => {
            return table.toggleAllPageRowsSelected(!!value)
          }}
          aria-label="Select all"
          className="!text-start"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center px-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            return row.toggleSelected(!!value)
          }}
          aria-label="Select row"
          className="!text-start"
        />
      </div>
    ),
  },
]

const actionColumns = ({
  mainRoute,
  actions,
  showActions,
  t,
  extraActions,
}: {
  mainRoute: string
  locale: string
  actions?: ('view' | 'edit' | 'delete')[]
  showActions?: boolean
  t: any
  extraActions?: (item: any) => React.ReactNode
}): ColumnDef<any>[] => {
  if (!showActions) {
    return []
  }
  return [
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
              {actions?.includes('view') && (
                <DropdownMenuItem>
                  <Link
                    className="flex w-full items-center justify-between"
                    href={`${mainRoute ? `/${mainRoute}` : ''}/${item.id}`}
                    prefetch={false}
                  >
                    <span>{t('view')}</span>
                    <Eye className="size-4" />
                  </Link>
                </DropdownMenuItem>
              )}
              {actions?.includes('edit') && (
                <DropdownMenuItem>
                  <Link
                    className="flex w-full items-center justify-between"
                    href={`${mainRoute ? `/${mainRoute}` : ''}/${routes.edit}/${item.id}`}
                    prefetch={false}
                  >
                    <span>{t('edit')}</span>
                    <Edit className="size-4" />
                  </Link>
                </DropdownMenuItem>
              )}
              {actions?.includes('delete') && (
                <DropdownMenuItem>
                  <Link
                    className="flex w-full items-center justify-between"
                    href={`${mainRoute ? `/${mainRoute}` : ''}/${routes.delete}/${item.id}`}
                    prefetch={false}
                  >
                    <span>{t('delete')}</span>
                    <Trash className="size-4" />
                  </Link>
                </DropdownMenuItem>
              )}
              {extraActions && extraActions(item)}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}

export interface AppTableProps {
  title: string
  data: any[]
  columns: ColumnDef<any>[]
  mainRoute?: string
  showActions?: boolean
  actions?: ('view' | 'edit' | 'delete')[]
  hideHeaders?: boolean
  selectedRows?: Record<string, boolean>
  onRowSelected?: (row: Updater<RowSelectionState>) => void
  showSelect?: boolean
  extraActions?: (item: any) => React.ReactNode
}

export function AppTable({
  title,
  data,
  columns,
  mainRoute = '',
  showActions = true,
  actions = ['view', 'edit', 'delete'],
  hideHeaders,
  showSelect = false,
  selectedRows,
  onRowSelected,
  extraActions,
}: AppTableProps) {
  const locale = useLocale()
  const t = useTranslations('table')
  const pathname = usePathname()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState(selectedRows ?? {})

  React.useEffect(() => {
    if (onRowSelected) {
      onRowSelected(rowSelection)
    }
  }, [onRowSelected, rowSelection])
  const table = useReactTable({
    data: data || [],
    columns: [
      ...(showSelect ? defaultColumns : []),
      ...columns,
      ...actionColumns({ mainRoute, locale, showActions, actions, t, extraActions }),
    ],
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      {!hideHeaders && (
        <div className="flex items-center justify-between py-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            {/* <p className="text-sm text-muted-foreground">{description}</p> */}
          </div>

          <div className="flex items-center gap-2">
            <Link href={`${pathname}/${routes.add}`} prefetch={false}>
              <Button variant={'secondary'} size={'icon'} type="button" className="px-8">
                <Plus />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" className="ml-auto">
                  {t('columns')} <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      // className={cn(locale === 'ar' ? 'text-right' : 'text-left')}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t('noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end gap-x-2 py-4">
        {/* <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} {t('selected')}
        </div> */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t('previous')}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t('next')}
          </Button>
        </div>
      </div>
    </div>
  )
}
