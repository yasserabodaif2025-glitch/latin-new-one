import React from 'react'
import { routes } from '@/lib/const/routes.enum'
import { DeleteModal } from '@/components/table'
import { deleteStudent } from '../../../student.action'

export default function DeleteStudentPage() {
  return <DeleteModal route={routes.students} action={deleteStudent} />
}
