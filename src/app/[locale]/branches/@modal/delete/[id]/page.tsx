import React from 'react'
import { routes } from '@/lib/const/routes.enum'
import { DeleteModal } from '@/components/table/delete-modal'
import { deleteBranch } from '../../../branch.action'

export default function DeleteBranchPage() {
  return <DeleteModal route={routes.branches} action={deleteBranch} />
}
