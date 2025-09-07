'use client'

import React from 'react'
import { areaSchema, AreaSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IArea } from './area.interface'
import { useCities } from '../../cities/(components)/useCities'
import { createArea, updateArea } from '../area.action'

type Props = {
  mode?: formMode
  data?: IArea
}

export const AreaForm = ({ mode = formMode.create, data }: Props) => {
  const t = useTranslations('area')
  const cities = useCities()
  const router = useRouter()

  const defaultValues = {
    id: data?.id ?? undefined,
    name: data?.name ?? '',
    description: data?.description ?? '',
    cityId: data?.cityId ?? 0,
  }
  const methods = useForm<AreaSchema>({
    resolver: zodResolver(areaSchema),
    defaultValues,
    disabled: mode === formMode.view,
  })

  const { control, handleSubmit, reset } = methods

  const onSubmit = async (values: AreaSchema) => {
    try {
      toast.info(t('creating'))
      if (mode === formMode.edit && data?.id) {
        await updateArea(data.id, values)
        toast.success(t('editSuccess'))
      } else {
        await createArea(values)
        toast.success(t('addSuccess'))
      }
      router.push(`/${routes.areas}`)
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
              <Link href={`/${routes.areas}`}>
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
            name="cityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('cityId')}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value + ''}
                    onValueChange={(e) => field.onChange(+e)}
                    disabled={mode === formMode.view}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('cityPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities?.map((area) => (
                        <SelectItem key={area.id} value={area.id + ''}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
