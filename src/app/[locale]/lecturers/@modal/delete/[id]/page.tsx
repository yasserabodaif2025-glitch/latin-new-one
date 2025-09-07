import React from 'react'
import { DeleteModal } from '@/components/table/delete-modal'
import { deleteLecturer } from '../../../lecturer.action'
import { routes } from '@/lib/const/routes.enum'

export default function DeleteLecturerModalPage() {
  return <DeleteModal action={deleteLecturer} route={routes.lecturers} />
}
