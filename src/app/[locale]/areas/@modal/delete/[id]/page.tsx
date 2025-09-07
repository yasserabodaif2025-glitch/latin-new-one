import React from 'react'
import { routes } from '@/lib/const/routes.enum'
import { DeleteModal } from '@/components/table/delete-modal'
import { deleteArea } from '../../../area.action'

export default function DeleteAreaPage() {
  return <DeleteModal route={routes.areas} action={deleteArea} />
}
