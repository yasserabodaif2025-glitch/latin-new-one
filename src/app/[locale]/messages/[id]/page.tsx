import { MessageForm } from '../(components)'
import { formMode } from '@/lib/const/form-mode.enum'
import { getMessage } from '../messages.action'

export default async function ViewMessagePage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const message = await getMessage(id)

  return <MessageForm data={message} mode={formMode.view} />
}
