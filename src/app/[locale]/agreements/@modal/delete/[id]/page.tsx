import React from 'react'
import { routes } from '@/lib/const/routes.enum'
import { DeleteModal } from '@/components/table/delete-modal'
import { deleteAgreement } from '../../../agreement.action'

export default function DeleteAgreementPage() {
  return <DeleteModal route={routes.agreements} action={deleteAgreement} />
}
