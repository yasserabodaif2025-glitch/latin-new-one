'use client'

import { categorySchema, CategorySchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useRouter } from '@/i18n/routing'
import { toast } from 'sonner'
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
import { createCategory, updateCategory } from '../category.action'
import { ICategory } from './category.interface'

type Props = {
  mode?: formMode
  data?: ICategory
}

export const CategoryForm = ({ mode = formMode.create, data }: Props) => {
  const t = useTranslations('category')
  const router = useRouter()
  const defaultValues = {
    id: data?.id ? data.id : undefined,
    name: data?.name ?? '',
    description: data?.description ?? '',
  }
  const methods = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues,
    disabled: mode === formMode.view,
  })

  const { control, handleSubmit, reset } = methods

  const onSubmit = async (values: CategorySchema) => {
    try {
      toast.info(t('creating'))
      if (mode === formMode.edit && data?.id) {
        await updateCategory(data.id, values)
        toast.success(t('editSuccess'))
      } else {
        await createCategory(values)
        toast.success(t('addSuccess'))
      }

      router.push(`/${routes.categories}`)
    } catch (error) {
      console.error(error)
      toast.error('something went wrong')
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
              <Link href={`/${routes.categories}`}>
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
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>{t('description')}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t('description')} {...field} />
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
