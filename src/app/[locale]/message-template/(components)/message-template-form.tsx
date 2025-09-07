'use client'

import { messageTemplateSchema, MessageTemplateSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Link, useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MessageTemplateInput } from '@/components/ui/message-template-input'
import { formMode } from '@/lib/const/form-mode.enum'
import { routes } from '@/lib/const/routes.enum'
import { useCourses } from '../../courses/(components)/useCourses'
import { IMessageTemplate } from './message-template.interface'
import { createMessageTemplate, updateMessageTemplate } from '../message-template.action'
import { useFlowSteps } from './useFlowSteps'
import { Switch } from '@/components/ui/switch'

type Props = {
  mode?: formMode
  data?: IMessageTemplate
}

export const MessageTemplateForm = ({ mode = formMode.create, data }: Props) => {
  const router = useRouter()
  const t = useTranslations('messageTemplate')
  const courses = useCourses()
  const flowSteps = useFlowSteps()
  const defaultValues: MessageTemplateSchema = {
    name: data?.name ?? '',
    body: data?.body ?? '',
    trigger: data?.trigger ?? '',
    courseId: data?.courseId ?? 0,
    sendAutomatically: data?.sendAutomatically ?? false,
  }
  const methods = useForm<MessageTemplateSchema>({
    resolver: zodResolver(messageTemplateSchema),
    defaultValues,
    disabled: mode === formMode.view,
  })

  const { control, handleSubmit, reset } = methods

  const onSubmit = async (values: MessageTemplateSchema) => {
    try {
      toast.info(t('creating'))
      if (mode === formMode.edit && data?.id) {
        await updateMessageTemplate(data?.id ?? 0, values)
        toast.success(t('editSuccess'))
      } else {
        await createMessageTemplate(values)
        toast.success(t('addSuccess'))
      }
      router.push(`/${routes.messageTemplate}`)
    } catch (error) {
      console.error(error)
    }
  }

  const getFormTitle = () => {
    if (mode === formMode.create) return t('create')
    if (mode === formMode.edit) return t('edit')
    return t('view')
  }

  return (
    <Form {...methods}>
      <form className="mt-10 w-full" onSubmit={handleSubmit(onSubmit)}>
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
              <Link href={`/${routes.messageTemplate}`}>
                <Button type="button" variant={'destructive'} size={'sm'}>
                  {t('cancel')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-4 rounded-xl border p-4 shadow-lg md:grid-cols-2">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('name')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('name')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="trigger"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('type')}</FormLabel>
                <Select
                  disabled={mode === formMode.view}
                  onValueChange={field.onChange}
                  value={field.value + ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('typeDescription')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {flowSteps?.map((flowStep) => (
                      <SelectItem key={flowStep.id} value={flowStep.id + ''}>
                        {flowStep.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('courseId')}</FormLabel>
                <Select onValueChange={(e) => field.onChange(+e)} value={field.value + ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectCourse')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses?.map((course) => (
                      <SelectItem key={course.id} value={course.id + ''}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="sendAutomatically"
            render={({ field }) => (
              <FormItem className="self-end">
                <FormLabel>{t('sendAutomatically')}</FormLabel>
                <FormControl>
                  <Switch className="mx-3" checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="body"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>{t('message')}</FormLabel>
                <FormControl>
                  <MessageTemplateInput
                    disabled={mode === formMode.view}
                    placeholder={t('messageDescription')}
                    {...field}
                  />
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
