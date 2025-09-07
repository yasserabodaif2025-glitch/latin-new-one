'use client'

import React, { useEffect } from 'react'
import { employeeSchema, EmployeeSchema } from '@/lib/schema/employee.schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { createEmployee, updateEmployee } from '../employee.action'
import { routes } from '@/lib/const/routes.enum'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { formMode } from '@/lib/const/formMode.enum'
import { IEmployee } from './employee.interface'
import { useCities } from '../../cities/(components)/useCities'
import { useSalaryTypes } from '@/components/hooks/useSalaryType'
import { Link, useRouter } from '@/i18n/routing'
import { PasswordInput } from '@/components/ui/password-input'
import useSWR from 'swr'
import { axiosFetcher } from '@/lib/swr-fetchers'
import { EmployeeStatus } from '@/lib/schema/employee.schema'

type Props = {
  mode?: formMode
  data?: IEmployee
}

export const EmployeeForm = ({ mode = formMode.create, data }: Props) => {
  const t = useTranslations('employee')
  const tTable = useTranslations('table')
  const cities = useCities()
  const { salaryTypes } = useSalaryTypes()
  const router = useRouter()

  const defaultValues: EmployeeSchema = {
    id: data?.id ? data.id : undefined,
    name: data?.name ?? '',
    email: data?.email ?? '',
    password: mode === formMode.create ? '' : undefined,
    phone: data?.phone ?? '',
    address: data?.address ?? '',
    nationalId: data?.nationalId ?? '',
    birthDate: data?.birthDate ?? '',
    cityId: data?.cityId ?? 0,
    department: data?.department ?? '',
    salary: data?.salary ?? 0,
    salaryTypeId: data?.salaryTypeId ?? 1,
    jobTitle: data?.jobTitle ?? '',
    status: data?.status ?? EmployeeStatus.ACTIVE,
    educationalQualificationId: data?.educationalQualificationId ?? 0,
    roleId: data?.roleId ?? 0,
  }

  const methods = useForm<EmployeeSchema>({
    resolver: zodResolver(employeeSchema),
    defaultValues,
    disabled: mode === formMode.view,
    mode: 'onChange',
  })

  const { control, handleSubmit, reset, setValue, getValues } = methods

  const onSubmit = async (values: EmployeeSchema) => {
    try {
      toast.info(mode === formMode.edit ? t('updating') : t('creating'))
      if (mode === formMode.edit && data?.id) {
        await updateEmployee(data.id, values)
        toast.success(t('editSuccess'))
      } else {
        await createEmployee(values)
        toast.success(t('addSuccess'))
      }
      router.push(`/${routes.employees}`)
    } catch (error) {
  // Try to surface a helpful message from the server action
  console.error('Employee form submit error:', error)
  const errMsg = (error as any)?.message || (error as any)?.toString() || t('error')
  toast.error(errMsg)
    }
  }

  const getFormTitle = () => {
    if (mode === formMode.create) return t('create')
    if (mode === formMode.edit) return t('edit')
    return t('view')
  }

  // استدعاء hooks للحصول على المؤهلات والأدوار
  // backend uses these PascalCase endpoints (see swagger)
  const { data: qualifications = [] as { id: number; name: string }[] } = useSWR(
    '/api/EducationalQualificationDescription',
    axiosFetcher
  )
  // Use axiosFetcher so axiosInstance interceptors (cookies/auth) are applied
  const { data: roles = [] as { id: number; name: string }[] } = useSWR('/api/Roles', axiosFetcher)

  // If creating a new employee and a roles list is available, default to the first role
  useEffect(() => {
    if (mode === formMode.create && roles?.length) {
      const current = getValues('roleId')
      if (!current || current === 0) {
        setValue('roleId', roles[0].id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles, mode])

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 w-full">
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
              <Link href={`/${routes.employees}`}>
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
                  <Input placeholder={t('email')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {mode === formMode.create && (
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
          )}

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
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('address')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('address')} {...field} />
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
                  <Select
                    value={field.value + ''}
                    onValueChange={(e) => field.onChange(+e)}
                    disabled={mode === formMode.view}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('cityId')} />
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

          <FormField
            control={control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('department')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('department')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('jobTitle')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('jobTitle')} {...field} />
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
            name="salaryTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('salaryType')}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value + ''}
                    onValueChange={(e) => field.onChange(+e)}
                    disabled={mode === formMode.view}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('salaryType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {salaryTypes?.map((type) => (
                        <SelectItem key={type.id} value={type.id + ''}>
                          {type.name}
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
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('birthDate')}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('status')}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={mode === formMode.view}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EmployeeStatus.ACTIVE}>{t('statusActive')}</SelectItem>
                      <SelectItem value={EmployeeStatus.SUSPENDED}>
                        {t('statusSuspended')}
                      </SelectItem>
                      <SelectItem value={EmployeeStatus.TRAINING}>{t('statusTraining')}</SelectItem>
                      <SelectItem value={EmployeeStatus.TERMINATED}>
                        {t('statusTerminated')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="educationalQualificationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('educationalQualification')}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value + ''}
                    onValueChange={(e) => field.onChange(+e)}
                    disabled={mode === formMode.view}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectQualification')} />
                    </SelectTrigger>
                    <SelectContent>
                      {qualifications && qualifications.length > 0 ? (
                        qualifications.map((qual: { id: number; name: string }) => (
                          <SelectItem key={qual.id} value={qual.id + ''}>
                            {qual.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-results" disabled>
                          {tTable('noResults') || '—'}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('role')}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value + ''}
                    onValueChange={(e) => field.onChange(+e)}
                    disabled={mode === formMode.view}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectRole')} />
                    </SelectTrigger>
                    <SelectContent>
                      {roles && roles.length > 0 ? (
                        roles.map((role: { id: number; name: string }) => (
                          <SelectItem key={role.id} value={role.id + ''}>
                            {role.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-results" disabled>
                          {tTable('noResults') || '—'}
                        </SelectItem>
                      )}
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
