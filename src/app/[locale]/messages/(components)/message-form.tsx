'use client'

import { messageSchema, MessageSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useRouter } from '@/i18n/routing'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { formMode } from '@/lib/const/form-mode.enum'
import { routes } from '@/lib/const/routes.enum'
import QRCode from 'react-qr-code'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IMessage } from './message.interface'
import { createMessage, getQrCode, sendMessage, updateMessage } from '../messages.action'
import { useBranches } from '../../branches/(components)/useBranches'
import axios from 'axios'
import { WhatsappStatus } from '@/components/whatsapp-status'

type Props = {
  mode?: formMode
  data?: IMessage
}

// const getQrCode = async () => {
//   const qr = await axios.get('http://198.7.125.213:4000/qr')
//   return qr.data
// }

// const sendMessage = async (phone: string, message: string) => {
//   const response = await axios.post('http://198.7.125.213:4000/send-message', {
//     number: phone,
//     message,
//   })
//   return response.data
// }

export const MessageForm = ({ mode = formMode.create, data }: Props) => {
  const t = useTranslations('message')
  const router = useRouter()

  const defaultValues = {
    id: data?.id ? data.id : undefined,
    phone: data?.phone ?? '',
    message: data?.message ?? '',
  }

  const methods = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
    defaultValues,
    disabled: mode === formMode.view,
  })

  const { control, handleSubmit, reset } = methods

  const onSubmit = async (values: MessageSchema) => {
    try {
      toast.info('Sending message...')

      if (mode === formMode.create) {
        await sendMessage({ number: values.phone, message: values.message })
        toast.success(t('addSuccess'))
      } else {
        await updateMessage(data?.id ?? 0, values)
        toast.success(t('editSuccess'))
      }

      reset(defaultValues)
      router.push(`/${routes.messages}`)
    } catch (error) {
      console.error(error)
      toast.error('Failed to send message')
    }
  }

  const getFormTitle = () => {
    if (mode === formMode.create) return t('create')
    if (mode === formMode.edit) return t('edit')
    return t('view')
  }

  return (
    <Form {...methods}>
      <form className="mt-10 w-full" onSubmit={handleSubmit(onSubmit, console.error)}>
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">{getFormTitle()}</h3>
          <div>
            <div className="mt-4 flex items-center justify-start gap-3 [&_button]:px-10">
              {mode !== formMode.view && (
                <>
                  <Button type="submit" variant={'default'} size={'sm'}>
                    {t('submit')}
                  </Button>
                  <Button
                    onClick={() => reset(defaultValues)}
                    type="reset"
                    variant={'secondary'}
                    size={'sm'}
                  >
                    {t('reset')}
                  </Button>
                </>
              )}
              <Link href={`/${routes.messages}`}>
                <Button type="button" variant={'destructive'} size={'sm'}>
                  {t('cancel')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <WhatsappStatus />

        <div className="mt-3 grid grid-cols-1 gap-4 rounded-xl border p-4 shadow-lg md:grid-cols-2">
          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('phone')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('phone')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('message')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('message')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}
