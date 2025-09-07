'use client'

import { lecturerSchema, LecturerSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Link, useRouter } from '@/i18n/routing'
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
import { useTranslations } from 'next-intl'
import { formMode } from '@/lib/const/form-mode.enum'
import { routes } from '@/lib/const/routes.enum'
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ILecturer } from './lecturer.interface'
import { updateLecturer, createLecturer } from '../lecturer.action'
// import { PasswordInput } from '@/components/ui/password-input'
import { Textarea } from '@/components/ui/textarea'
import { useCities } from '../../cities/(components)/useCities'
import { MultiSelect } from '@/components/ui/select-multi'
import { useCourses } from '../../courses/(components)/useCourses'
import { useSalaryTypes } from '@/components/hooks/useSalaryType'

type Props = {
  mode?: formMode
  data?: ILecturer
}

export const LecturerForm = ({ mode = formMode.create, data }: Props) => {
  const t = useTranslations('lecturer')
  const cities = useCities()
  const courses = useCourses()
  const { salaryTypes } = useSalaryTypes()

  const router = useRouter()

  const defaultValues: LecturerSchema = {
    id: data?.id ? data.id : undefined,
    name: data?.name ?? '',
    email: data?.email ?? '',
    password: '',
    phone: data?.phone ?? '',
    address: data?.address ?? '',
    nationalId: data?.nationalId ?? '',
    cityId: data?.cityId ?? 0,
    coursesIds: data?.coursesIds?.map((course) => course + '') ?? [],
    salary: data?.salary ?? undefined,
    salaryTypeId: data?.salaryTypeId ?? 1,
  }
  const methods = useForm<LecturerSchema>({
    resolver: zodResolver(lecturerSchema),
    defaultValues,
    disabled: mode === formMode.view,
  })

  const { control, handleSubmit, reset, setValue } = methods

  const onSubmit = async (values: LecturerSchema) => {
    toast.info(t('creating'))
    try {
      if (mode === formMode.edit && data?.id) {
        await updateLecturer(data.id, values)
        toast.success(t('editSuccess'))
      } else {
        await createLecturer(values)
        toast.success(t('addSuccess'))
      }
      router.push(`/${routes.lecturers}`)
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
              <Link href={`/${routes.lecturers}`}>
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
            name="email"
            disabled={mode !== formMode.create}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('email')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t('email')}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value.toLowerCase())
                      if (e.target.value.includes('@')) {
                        setValue(
                          'password',
                          e.target.value[0].toUpperCase() +
                            e.target.value.split('@')[0].slice(1) +
                            '@' +
                            '12345'
                        )
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* {mode === formMode.create && (
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password')}</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder={t('password')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )} */}

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
            name="nationalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('nationalId')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('nationalId')} {...field} />
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
                  <Select value={field.value + ''} onValueChange={(e) => field.onChange(+e)}>
                    <SelectTrigger disabled={mode === formMode.view}>
                      <SelectValue placeholder={t('cityId')} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities?.map((city) => (
                        <SelectItem key={city.id} value={city.id + ''}>
                          {city.name}
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
            name="coursesIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('coursesIds')}</FormLabel>
                <MultiSelect
                  disabled={mode === formMode.view}
                  placeholder={t('selectCourses')}
                  options={
                    courses?.map((course) => ({
                      label: course.name,
                      value: course.id + '',
                    })) ?? []
                  }
                  value={field.value.map((value) => value + '')}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="salaryTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('salaryType')}</FormLabel>
                <FormControl>
                  <Select value={field.value + ''} onValueChange={(e) => field.onChange(+e)}>
                    <SelectTrigger disabled={mode === formMode.view}>
                      <SelectValue placeholder={t('salaryType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {salaryTypes?.map((salaryType) => (
                        <SelectItem key={salaryType.id} value={salaryType.id + ''}>
                          {salaryType.name}
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
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('salary')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t('salary')}
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
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
