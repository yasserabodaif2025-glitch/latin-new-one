import React from 'react'
import { routes } from '@/lib/const/routes.enum'
import { DeleteModal } from '@/components/table/delete-modal'
import { deleteQualificationIssuer } from '../../../qualification-issuer.action'

export default function DeleteQualificationIssuerPage() {
  return <DeleteModal route={routes.qualificationIssuer} action={deleteQualificationIssuer} />
}
