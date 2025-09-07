import React from 'react'
import { routes } from '@/lib/const/routes.enum'
import { DeleteModal } from '@/components/table/delete-modal'
import { deleteQualificationDescription } from '../../../qualification-description.action'

export default function DeleteQualificationDescriptionPage() {
  return (
    <DeleteModal route={routes.qualificationDescription} action={deleteQualificationDescription} />
  )
}
