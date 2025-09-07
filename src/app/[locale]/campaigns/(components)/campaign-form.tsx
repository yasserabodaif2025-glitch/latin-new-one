'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Link, useRouter } from '@/i18n/routing'
import { campaignSchema, CampaignSchema } from '@/lib/schema/campaign.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { routes } from '@/lib/const/routes.enum'
import { formMode } from '@/lib/const/form-mode.enum'
import { useLocale, useTranslations } from 'next-intl'
import { createCampaign, updateCampaign } from '../campaign.action'
import { ICampaign } from './campaign.interface'
import { DatePicker } from '@/components/ui/date-picker'
import { useCourses } from '@/app/[locale]/courses/(components)/useCourses'
import { MultiSelect } from '@/components/ui/select-multi'
import { useBranches } from '@/app/[locale]/branches/(components)/useBranches'
type Props = {
  mode?: formMode
  data?: ICampaign
}

export const CampaignForm = ({ mode = formMode.create, data }: Props) => {
  const locale = useLocale()
  const t = useTranslations('campaign')
  const router = useRouter()
  const courses = useCourses()
  const branches = useBranches()

  const defaultValues: CampaignSchema = {
    id: data?.id ? data.id : undefined,
    name: data?.name ?? '',
    description: data?.description ?? '',
    coursesIds: data?.coursesIds ?? [],
    branchIds: data?.branchIds ?? [],
    startDate: data?.startDate ? new Date(data.startDate) : new Date(),
    endDate: data?.endDate ? new Date(data.endDate) : new Date(),
    // status: data?.status ?? 'draft',
    // leads:
    //   data?.leads?.map((lead) => ({
    //     name: lead.name,
    //     phone: lead.phone,
    //     email: lead.email,
    //     courseId: lead.courseId,
    //   })) ?? [],
  }

  const methods = useForm<CampaignSchema>({
    resolver: zodResolver(campaignSchema),
    defaultValues,
    disabled: mode === formMode.view,
  })

  const { control, handleSubmit, reset, setValue, watch } = methods

  const onSubmit = async (values: CampaignSchema) => {
    try {
      toast.info(t('creating'))
      if (mode === formMode.edit && data?.id) {
        await updateCampaign(data.id, values)
        toast.success(t('editSuccess'))
      } else {
        await createCampaign(values)
        toast.success(t('addSuccess'))
      }
      reset(defaultValues)
      router.push(`/${routes.campaigns}`)
    } catch (error) {
      console.error(error)
      toast.error(mode === formMode.create ? t('addError') : t('editError'))
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
              <Link href={`/${routes.campaigns}`}>
                <Button type="button" variant={'destructive'} size={'sm'}>
                  {t('cancel')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="h-full">
          <div className="mt-3 h-full gap-4 space-y-4 rounded-xl border p-4 shadow-lg">
            <FormField
              control={control}
              name="name"
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('name')}
                      {...field}
                      className={cn(error && 'border-red-500')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t('startDate')}</FormLabel>
                    <FormControl>
                      <DatePicker
                        isRTL={locale === 'ar'}
                        btnClassName="w-full"
                        disabled={mode === formMode.view}
                        className="w-full"
                        value={field.value as Date}
                        onChange={(e) => {
                          field.onChange(e)
                          if (e && watch('endDate') && e > watch('endDate')) {
                            setValue('endDate', e)
                          }
                        }}
                        fromDate={new Date()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t('endDate')}</FormLabel>
                    <FormControl>
                      <DatePicker
                        isRTL={locale === 'ar'}
                        btnClassName="w-full"
                        disabled={mode === formMode.view}
                        className="w-full"
                        value={field.value as Date}
                        onChange={(e) => {
                          field.onChange(e)
                          if (e && watch('startDate') && e < watch('startDate')) {
                            setValue('startDate', e)
                          }
                        }}
                        fromDate={new Date()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="coursesIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('course')}</FormLabel>
                    <MultiSelect
                      disabled={mode === formMode.view}
                      placeholder={t('course')}
                      options={
                        courses?.map((course) => ({
                          label: course.name,
                          value: course.id + '',
                        })) ?? []
                      }
                      value={field.value.map((value) => value + '')}
                      onChange={(e) => field.onChange(e.map((value) => +value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="branchIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('branch')}</FormLabel>
                    <MultiSelect
                      disabled={mode === formMode.view}
                      placeholder={t('branch')}
                      options={
                        branches?.map((branch) => ({
                          label: branch.name,
                          value: branch.id + '',
                        })) ?? []
                      }
                      value={field.value.map((value) => value + '')}
                      onChange={(e) => field.onChange(e.map((value) => +value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('description')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('description')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* <div className="mt-3 h-full flex-grow overflow-auto rounded-xl border p-4 shadow-lg">
            <ExcelUpload />
          </div> */}
        </div>
      </form>
    </Form>
  )
}
