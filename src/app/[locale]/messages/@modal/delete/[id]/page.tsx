import React from 'react'
import { routes } from '@/lib/const/routes.enum'
import { DeleteModal } from '@/components/table/delete-modal'
import { deleteMessage } from '../../../messages.action'

export default function DeleteMessagePage() {
  return <DeleteModal route={routes.messages} action={deleteMessage} />
}
