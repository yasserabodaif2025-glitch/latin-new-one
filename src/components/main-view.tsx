'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Button } from './ui/button'
import { LayoutGrid, Plus, Table } from 'lucide-react'
import { routes } from '@/lib/const/routes.enum'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AppTable, AppTableProps } from './table'
import { AppCardView, AppCardViewProps } from './ui'

interface MainViewProps extends AppTableProps, AppCardViewProps {
  title: string
}

export const MainView = ({
  title,
  data,
  columns,
  renderCard,
  gridClassName,
  mainRoute,
  showActions,
  actions,
  hideHeaders,
  selectedRows,
  onRowSelected,
  showSelect,
  extraActions,
}: MainViewProps) => {
  const searchParams = useSearchParams()
  const viewParam = searchParams.get('view') || 'table'
  const [view, setView] = useState<'table' | 'card'>((viewParam as 'table' | 'card') ?? 'table')
  const pathname = usePathname()

  return (
    <div className="w-full">
      <div className="flex flex-col items-start justify-between gap-4 py-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          {/* <p className="text-sm text-muted-foreground">{description}</p> */}
        </div>

        <div className="flex items-start justify-center gap-2 md:items-center">
          <ViewToggle view={view} setView={setView} />
          <Link href={`${pathname}/${routes.add}`}>
            <Button variant={'secondary'} size={'icon'} type="button" className="px-8">
              <Plus />
            </Button>
          </Link>
        </div>
      </div>
      {view === 'table' ? (
        <AppTable
          hideHeaders
          title={title}
          data={data}
          columns={columns}
          mainRoute={mainRoute}
          showActions={showActions}
          actions={actions}
          selectedRows={selectedRows}
          onRowSelected={onRowSelected}
          extraActions={extraActions}
        />
      ) : (
        <AppCardView data={data} renderCard={renderCard} gridClassName={gridClassName} />
      )}
    </div>
  )
}

const ViewToggle = ({
  view,
  setView,
}: {
  view: 'table' | 'card'
  setView: (view: 'table' | 'card') => void
}) => {
  const searchParams = useSearchParams()
  const updateView = (view: 'table' | 'card') => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('view', view)
    window.history.pushState(null, '', `${window.location.pathname}?${newSearchParams}`)
    setView(view)
  }
  return (
    <div className="flex gap-2">
      <Button
        variant={view === 'table' ? 'default' : 'outline'}
        onClick={() => updateView('table')}
        size="sm"
      >
        <Table className="mr-1 h-4 w-4" /> جدول
      </Button>
      <Button
        variant={view === 'card' ? 'default' : 'outline'}
        onClick={() => updateView('card')}
        size="sm"
      >
        <LayoutGrid className="mr-1 h-4 w-4" /> كروت
      </Button>
    </div>
  )
}
