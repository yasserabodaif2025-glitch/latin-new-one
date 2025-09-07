import { MessageTable } from './(components)'
// import { getMessages } from './messages.action'

export default async function MessageTemplatePage() {
  // const messageTemplates = await getMessages()
  return <MessageTable data={[]} />
}
