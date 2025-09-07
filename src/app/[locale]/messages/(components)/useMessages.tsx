import { useEffect, useState } from 'react'
import { getMessages } from '../messages.action'
import { IMessage } from './message.interface'

export const useMessages = () => {
  const [messages, setMessages] = useState<IMessage[]>([])
  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages()
      setMessages(messages.data)
    }
    fetchMessages()
    return () => {
      setMessages([])
    }
  }, [])
  return messages
}
