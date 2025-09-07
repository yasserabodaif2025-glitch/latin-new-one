import { MessageTemplateTable } from './(components)/message-template-table'
import { getMessageTemplates } from './message-template.action'

export default async function MessageTemplatePage() {
  const messageTemplates = await getMessageTemplates()
  return <MessageTemplateTable data={messageTemplates.data} />
}
