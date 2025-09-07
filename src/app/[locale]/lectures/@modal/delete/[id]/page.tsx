import React from 'react'
import { routes } from '@/lib/const/routes.enum'
import { DeleteModal } from '@/components/table/delete-modal'
import { deleteLecture } from '../../../lecture.action'
export default function DeleteLecturePage() {
  return <DeleteModal route={routes.lectures} action={deleteLecture} />
}
