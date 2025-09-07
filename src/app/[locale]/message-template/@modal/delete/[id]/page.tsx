import React from 'react'
import { routes } from '@/lib/const/routes.enum'
import { DeleteModal } from '@/components/table'
import { deleteMessageTemplate } from '../../../message-template.action'

export default function DeleteCoursePage() {
  return <DeleteModal route={routes.messageTemplate} action={deleteMessageTemplate} />
}
