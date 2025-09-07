import React from 'react'

export interface AppCardViewProps {
  data: any[]
  mainRoutes?: string
  showActions?: boolean
  actions?: ('view' | 'edit' | 'delete')[]
  extraActions?: (item: any) => React.ReactNode
  gridClassName?: string
  renderCard: (item: any, idx: number) => React.ReactNode
}

export function AppCardView({
  data,
  mainRoutes,
  showActions,
  actions,
  extraActions,
  gridClassName = 'grid gap-6',
  renderCard,
}: AppCardViewProps) {
  return <div className="space-y-6">{data.map((item, idx) => renderCard(item, idx))}</div>
}
