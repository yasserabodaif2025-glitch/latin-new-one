import { MessageTemplateForm } from '../../(components)/message-template-form'
import { formMode } from '@/lib/const/form-mode.enum'
// import { MessageTemplate } from '@prisma/client'
import { getMessageTemplate } from '../../message-template.action'

export default async function EditMessageTemplatePage({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params
  const data = await getMessageTemplate(id)
  return <MessageTemplateForm mode={formMode.edit} data={data} />
}
