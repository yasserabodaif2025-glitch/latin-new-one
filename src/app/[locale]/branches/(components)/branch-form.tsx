'use client'

import { branchSchema, BranchSchema } from '@/lib/schema'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { IBranch } from '.'
import { createBranch, updateBranch } from '../branch.action'
import { useAreas } from '@/app/[locale]/areas/(components)'
type Props = {
  mode?: formMode
  data?: IBranch
}

export const BranchForm = ({ mode = formMode.create, data }: Props) => {
  const t = useTranslations('branch')
  const areas = useAreas()
  const defaultValues = {
    id: data?.id ? data.id : undefined,
    name: data?.name ?? '',
    address: data?.address ?? '',
    areaId: data?.areaId ? data.areaId : undefined,
  }
  const methods = useForm<BranchSchema>({
    resolver: zodResolver(branchSchema),
    defaultValues,
    disabled: mode === formMode.view,
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods

  const router = useRouter()

  const onSubmit = async (values: BranchSchema) => {
    try {
      toast.info(t('creating'))
      if (mode === formMode.edit && data?.id) {
        await updateBranch(data.id, values)
        toast.success(t('editSuccess'))
      } else {
        await createBranch(values)
        toast.success(t('addSuccess'))
      }
      router.push(`/${routes.branches}`)
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
              <Link href={`/${routes.branches}`}>
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

          {/* <FormField
            control={control}
            name="cityId"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>{t('cityId')}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(e) => {
                      field.onChange(e)
                      setValue('areaId', undefined as any)
                    }}
                  >
                    <SelectTrigger className={cn(errors.areaId && 'border-red-500')}>
                      <SelectValue placeholder={t('cityPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities?.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />*/}

          <FormField
            control={control}
            name="areaId"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>{t('areaId')}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value + ''}
                    onValueChange={(e) => field.onChange(+e)}
                    disabled={mode === formMode.view}
                  >
                    <SelectTrigger className={cn(errors.areaId && 'border-red-500')}>
                      <SelectValue placeholder={t('areaPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {areas?.map((area) => (
                        <SelectItem key={area.id + ''} value={area.id + ''}>
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

          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>{t('address')}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t('address')} {...field} />
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
