'use client'

import { leadSchema, LeadSchema } from '@/lib/schema/lead.schema'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { formMode } from '@/lib/const/form-mode.enum'
import { routes } from '@/lib/const/routes.enum'
import { useTranslations } from 'next-intl'
import { useCourses } from '@/app/[locale]/courses/(components)/useCourses'
import { useCampaigns } from '@/app/[locale]/campaigns/(components)/useCampaigns'
import { ILead } from './lead.interface'
import { createLead, updateLead } from '../lead.action'
import { useAreas } from '@/app/[locale]/areas/(components)/useAreas'
import { useQualificationDescriptions } from '@/app/[locale]/qualification-description/(components)/useQualificationDescription'
import { useQualificationTypes } from '@/app/[locale]/qualification-type/(components)/useQualificationTypes'
import { useQualificationIssuers } from '@/app/[locale]/qualification-issuer/(components)/useQualificationIssuers'
import { useStudents } from '@/app/[locale]/students/(components)/useStudents'
import { useAgreements } from '@/app/[locale]/agreements/(components)/useAgreement'
import { DatePicker } from '@/components/ui/date-picker'

type Props = {
  mode?: formMode
  data?: ILead
}

export const LeadForm = ({ mode = formMode.create, data }: Props) => {
  const t = useTranslations('lead')
  const courses = useCourses()
  const { campaigns } = useCampaigns()
  const router = useRouter()
  const areas = useAreas()
  const qualificationDescriptions = useQualificationDescriptions()
  const qualificationTypes = useQualificationTypes()
  const qualificationIssuers = useQualificationIssuers()
  const { students } = useStudents()
  const { agreements: studentSources } = useAgreements()
  const defaultValues: LeadSchema = {
    name: data?.name ?? '',
    email: data?.email ?? '',
    phone: data?.phone ?? '',
    courseId: data?.courseId ?? 0,
    campaignId: data?.campaignId ?? undefined,
    areaId: data?.areaId ?? 0,
    birthdate: data?.birthdate ? new Date(data.birthdate) : new Date(),
    // educationalQualificationDescriptionId: data?.educationalQualificationDescriptionId ?? 0,
    // educationalQualificationTypeId: data?.educationalQualificationTypeId ?? 0,
    // educationalQualificationIssuerId: data?.educationalQualificationIssuerId ?? 0,
    // studentSourceId: data?.studentSourceId ?? 0,
    // status: data?.status ?? '',
    // studentId: data?.studentId ?? 0,
  }
  const methods = useForm<LeadSchema>({
    resolver: zodResolver(leadSchema),
    defaultValues,
    disabled: mode === formMode.view,
  })

  const { control, handleSubmit, reset } = methods

  const onSubmit = async (values: LeadSchema) => {
    try {
      toast.info(t('creating'))
      if (mode === formMode.edit && data?.id) {
        await updateLead(data.id, values)
        toast.success(t('editSuccess'))
      } else {
        await createLead(values)
        toast.success(t('addSuccess'))
      }
      router.push(`/${routes.leads}`)
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
              <Link href={`/${routes.leads}`}>
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
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('courseId')}</FormLabel>
                <FormControl>
                  <Select
                    disabled={mode === formMode.view}
                    value={field.value + ''}
                    onValueChange={(e) => field.onChange(+e)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectCourse')} />
                    </SelectTrigger>
                    <SelectContent>
                      {courses?.map((course) => (
                        <SelectItem key={course.id} value={course.id + ''}>
                          {course.name}
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
            name="campaignId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('campaignId')}</FormLabel>
                <FormControl>
                  <Select
                    disabled={mode === formMode.view}
                    value={field.value ? field.value + '' : ''}
                    onValueChange={(e) => field.onChange(+e)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectCampaign')} />
                    </SelectTrigger>
                    <SelectContent>
                      {campaigns && campaigns.length > 0 ? (
                        campaigns.map((campaign) => (
                          <SelectItem key={campaign.id} value={campaign.id + ''}>
                            {campaign.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-4 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-800">
                          <Link href={`/${routes.campaigns}/${routes.add}`} className="w-full">
                            {t('noCampaigns')}{' '}
                            <span className="text-indigo-700 underline">
                              ({t('clickToCreate')})
                            </span>
                          </Link>
                        </div>
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
            name="areaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('areaId')}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value + ''}
                    onValueChange={(e) => field.onChange(+e)}
                    disabled={mode === formMode.view}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('areaId')} />
                    </SelectTrigger>
                    <SelectContent>
                      {areas?.map((area) => (
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
            name="birthdate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('birthdate')}</FormLabel>
                <FormControl>
                  <DatePicker
                    isRTL={false}
                    btnClassName="w-full"
                    className="w-full"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={mode === formMode.view}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={control}
            name="educationalQualificationDescriptionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('educationalQualificationDescriptionId')}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value + ''}
                    onValueChange={(e) => field.onChange(+e)}
                    disabled={mode === formMode.view}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('educationalQualificationDescriptionId')} />
                    </SelectTrigger>
                    <SelectContent>
                      {qualificationDescriptions?.map((qd) => (
                        <SelectItem key={qd.id} value={qd.id + ''}>
                          {qd.name}
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
            name="educationalQualificationTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('educationalQualificationTypeId')}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value + ''}
                    onValueChange={(e) => field.onChange(+e)}
                    disabled={mode === formMode.view}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('educationalQualificationTypeId')} />
                    </SelectTrigger>
                    <SelectContent>
                      {qualificationTypes?.map((qt) => (
                        <SelectItem key={qt.id} value={qt.id + ''}>
                          {qt.name}
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
            name="educationalQualificationIssuerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('educationalQualificationIssuerId')}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value + ''}
                    onValueChange={(e) => field.onChange(+e)}
                    disabled={mode === formMode.view}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('educationalQualificationIssuerId')} />
                    </SelectTrigger>
                    <SelectContent>
                      {qualificationIssuers?.map((qi) => (
                        <SelectItem key={qi.id} value={qi.id + ''}>
                          {qi.name}
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
            name="studentSourceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('studentSourceId')}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value + ''}
                    onValueChange={(e) => field.onChange(+e)}
                    disabled={mode === formMode.view}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('studentSourceId')} />
                    </SelectTrigger>
                    <SelectContent>
                      {studentSources?.map((ss) => (
                        <SelectItem key={ss.id} value={ss.id + ''}>
                          {ss.name}
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
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('studentId')}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value + ''}
                    onValueChange={(e) => field.onChange(+e)}
                    disabled={mode === formMode.view}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectStudent')} />
                    </SelectTrigger>
                    <SelectContent>
                      {students?.map((student) => (
                        <SelectItem key={student.id} value={student.id + ''}>
                          {student.name}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('status')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('status')} {...field} disabled={mode === formMode.view} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>
      </form>
    </Form>
  )
}
