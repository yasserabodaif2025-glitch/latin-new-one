import React from 'react'
import { routes } from '@/lib/const/routes.enum'
import { DeleteModal } from '@/components/table/delete-modal'
import { deleteLab } from '../../../lab.action'

export default function DeleteLabPage() {
  return <DeleteModal route={routes.labs} action={deleteLab} />
}
