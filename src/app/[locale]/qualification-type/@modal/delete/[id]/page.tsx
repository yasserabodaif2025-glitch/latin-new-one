import React from 'react'
import { routes } from '@/lib/const/routes.enum'
import { DeleteModal } from '@/components/table/delete-modal'
import { deleteQualificationType } from '../../../qualification-type.action'

export default function DeleteQualificationTypePage() {
  return <DeleteModal route={routes.qualificationType} action={deleteQualificationType} />
}
