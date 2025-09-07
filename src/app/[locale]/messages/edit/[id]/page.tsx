import { formMode } from '@/lib/const/form-mode.enum'
import { MessageForm } from '../../(components)'
import { getMessage } from '../../messages.action'

export default async function EditMessagePage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const message = await getMessage(id)

  return <MessageForm data={message} mode={formMode.edit} />
}
