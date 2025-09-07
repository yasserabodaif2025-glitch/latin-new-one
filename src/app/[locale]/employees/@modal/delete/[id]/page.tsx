import React from 'react'
import { routes } from '@/lib/const/routes.enum'
import { DeleteModal } from '@/components/table/delete-modal'
import { deleteEmployee } from '../../../employee.action'

export default function DeleteEmployeePage() {
  return <DeleteModal route={routes.employees} action={deleteEmployee} />
}
