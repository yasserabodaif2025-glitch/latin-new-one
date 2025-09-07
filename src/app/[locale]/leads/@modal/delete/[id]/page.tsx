import React from 'react'
import { routes } from '@/lib/const/routes.enum'
import { DeleteModal } from '@/components/table'
import { deleteLead } from '../../../lead.action'

export default function DeleteLeadPage() {
  return <DeleteModal route={routes.leads} action={deleteLead} />
}
