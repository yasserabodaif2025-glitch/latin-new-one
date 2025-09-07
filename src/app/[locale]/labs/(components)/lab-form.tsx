'use client'

import { labSchema, LabSchema } from '@/lib/schema'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ILab } from './lab.interface'
import { createLab, updateLab } from '../lab.action'
import { useBranches } from '../../branches/(components)/useBranches'
import { useLabTypes } from './useLabTypes'

type Props = {
  mode?: formMode
  data?: ILab
}

export const LabForm = ({ mode = formMode.create, data }: Props) => {
  const t = useTranslations('lab')
  const branches = useBranches()
  const labTypes = useLabTypes()
  const router = useRouter()
  const defaultValues: LabSchema = {
    id: data?.id ? data.id : undefined,
    name: data?.name ?? '',
    type: data?.type ?? '',
    branchId: data?.branchId ?? 0,
    capacity: data?.capacity ?? 0,
  }
  const methods = useForm<LabSchema>({
    resolver: zodResolver(labSchema),
    defaultValues,
    disabled: mode === formMode.view,
  })

  const { control, handleSubmit, reset } = methods

  const onSubmit = async (values: LabSchema) => {
    try {
      toast.info(t('creating'))
      if (mode === formMode.edit && data?.id) {
        await updateLab(data.id, values)
        toast.success(t('editSuccess'))
      } else {
        await createLab(values)
        toast.success(t('addSuccess'))
      }
      router.push(`/${routes.labs}`)
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
              <Link href={`/${routes.labs}`}>
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('type')}</FormLabel>
                <FormControl>
                  <Select
                    disabled={mode === formMode.view}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('type')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {labTypes?.map((type) => (
                          <SelectItem key={type.id} value={type.name}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('capacity')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t('capacity')}
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '' || !isNaN(Number(value))) {
                        field.onChange(+value)
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="branchId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('branch')}</FormLabel>
                <FormControl>
                  <Select
                    disabled={mode === formMode.view}
                    value={field.value + ''}
                    onValueChange={(e) => field.onChange(+e)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectBranchPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {branches?.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id + ''}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
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
