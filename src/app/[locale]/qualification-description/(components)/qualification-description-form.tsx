'use client'

import {
  qualificationDescriptionSchema,
  QualificationDescriptionSchema,
} from '@/lib/schema/qualification-description.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { formMode } from '@/lib/const/form-mode.enum'
import { routes } from '@/lib/const/routes.enum'
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
import { Textarea } from '@/components/ui/textarea'
import { IQualificationDescription } from './qualification-description.interface'
import {
  createQualificationDescription,
  updateQualificationDescription,
} from '../qualification-description.action'
import { toast } from 'sonner'

type Props = {
  mode?: formMode
  data?: IQualificationDescription
}

export const QualificationDescriptionForm = ({ mode = formMode.create, data }: Props) => {
  const t = useTranslations('qualificationDescription')
  const router = useRouter()
  const defaultValues = {
    id: data?.id ? data.id : undefined,
    name: data?.name ?? '',
  }
  const methods = useForm<QualificationDescriptionSchema>({
    resolver: zodResolver(qualificationDescriptionSchema),
    defaultValues,
    disabled: mode === formMode.view,
  })

  const { control, handleSubmit, reset } = methods

  const onSubmit = async (values: QualificationDescriptionSchema) => {
    try {
      toast.info(t('creating'))
      if (mode === formMode.edit && data?.id) {
        await updateQualificationDescription(data?.id ?? 0, values)
        toast.success(t('editSuccess'))
      } else {
        await createQualificationDescription(values)
        toast.success(t('addSuccess'))
      }

      router.push(`/${routes.qualificationDescription}`)
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
              <Link href={`/${routes.qualificationDescription}`}>
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
        </div>
      </form>
    </Form>
  )
}
