import { MessageTemplateForm } from '../(components)'
import { formMode } from '@/lib/const/form-mode.enum'
import { getMessageTemplate } from '../message-template.action'

export default async function ViewMessageTemplatePage({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params
  const data = await getMessageTemplate(id)
  return <MessageTemplateForm mode={formMode.view} data={data} />
}
