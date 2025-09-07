'use client'

import { courseSchema, CourseSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
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
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { formMode } from '@/lib/const/form-mode.enum'
import { routes } from '@/lib/const/routes.enum'
import {
  SelectGroup,
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ICourse } from './course.interface'
import { createCourse, updateCourse } from '../course.action'
import { useCategories } from '../../categories/(components)/useCategory'
import { Plus, Trash2 } from 'lucide-react'

type Props = {
  mode?: formMode
  data?: ICourse
}

export const CourseForm = ({ mode = formMode.create, data }: Props) => {
  const t = useTranslations('course')
  const categories = useCategories()
  const router = useRouter()
  const defaultValues: CourseSchema = {
    id: data?.id ? data.id : undefined,
    name: data?.name ?? '',
    description: data?.description ?? '',
    categoryId: data?.categoryId ?? 0,
    isActive: true,
    levels: [
      ...(data?.levels.map((level) => ({
        name: level.name,
        price: level.price,
        description: level.description,
        sessionsDiortion: level.sessionsDiortion,
        sessionsCount: level.sessionsCount,
      })) ?? [
        {
          name: '',
          price: 0,
          description: '',
          sessionsDiortion: 0,
          sessionsCount: 0,
        },
      ]),
    ],
  }
  const methods = useForm<CourseSchema>({
    resolver: zodResolver(courseSchema),
    defaultValues,
    disabled: mode === formMode.view,
  })

  const { control, handleSubmit, reset } = methods
  const levels = useWatch({ control, name: 'levels' })
  const totals = React.useMemo(() => {
    const count = levels?.reduce((acc: number, level) => acc + (level?.sessionsCount || 0), 0) || 0
    const price = levels?.reduce((acc: number, level) => acc + (level?.price || 0), 0) || 0
    return { count, price }
  }, [levels])

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'levels',
  })

  const onSubmit = async (values: CourseSchema) => {
    try {
      toast.info(t('creating'))
      if (mode === formMode.edit && data?.id) {
        await updateCourse(data.id, values)
        toast.success(t('editSuccess'))
      } else {
        await createCourse(values)
        toast.success(t('addSuccess'))
      }

      router.push(`/${routes.courses}`)
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
                    onClick={() =>
                      reset({
                        name: '',
                        description: '',
                      })
                    }
                    type="reset"
                    variant={'secondary'}
                    size={'sm'}
                  >
                    {t('reset')}
                  </Button>
                </>
              )}
              <Link href={`/${routes.courses}`}>
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
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('categoryId')}</FormLabel>
                <FormControl>
                  <Select value={field.value + ''} onValueChange={(e) => field.onChange(+e)}>
                    <SelectTrigger disabled={mode === formMode.view}>
                      <SelectValue placeholder={t('selectCategoryPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories?.map((category) => (
                          <SelectItem key={category.id + ''} value={category.id + ''}>
                            {category.name}
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

          <div className="md:col-span-2">
            <h3 className="text-xl text-zinc-500">{t('levels')}</h3>

            {fields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-5 items-end gap-2">
                <FormField
                  control={control}
                  name={`levels.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('courseLevelName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('courseLevelName')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`levels.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('cost')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('cost')}
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) ?? 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`levels.${index}.sessionsDiortion`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('sessionDiortion')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t('sessionDiortion')}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) ?? 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`levels.${index}.sessionsCount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('sessionsCount')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('sessionsCount')}
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) ?? 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {mode !== formMode.view && (
                  <Button type="button" variant={'destructive'} onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4" />
                    {t('removeCourseLevel')}
                  </Button>
                )}
              </div>
            ))}
            <div className="mt-3 grid grid-cols-5 items-end gap-2">
              <div className="col-span-4 text-sm text-zinc-500">
                {t('courseLevels')}{' '}
                <span className="text-indigo-700">{levels?.length || 0}</span>{' '}
                {t('courseLevelsCount')}{' '}
                <span className="text-indigo-700">{totals.price}</span>{' '}
                {/* {t('courseLevelsCost')}{' '}
                <span className="text-indigo-700">
                  {watch('levels').reduce((acc, level) => acc + level.sessionsDiortion, 0)}
                </span>{' '} */}
                {t('courseLevelsDuration')}{' '}
                <span className="text-indigo-700">{totals.count}</span>
              </div>
              {/* <div className="self-center text-xl text-zinc-500">{t('totals')}</div>
              <FormItem>
                <FormLabel>{t('totalCost')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('totalCost')}
                    type="number"
                    value={
                      watch('levels')?.reduce(
                        (acc: number, level) => acc + (level.price || 0),
                        0
                      ) || 0
                    }
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>{t('totalDuration')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('totalDuration')}
                    type="number"
                    value={
                      watch('levels')?.reduce(
                        (acc: number, level) => acc + (level.sessionsDiortion || 0),
                        0
                      ) || 0
                    }
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem> 

              <FormItem>
                <FormLabel>{t('totalSessions')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('totalSessions')}
                    type="number"
                    value={
                      watch('levels')?.reduce(
                        (acc: number, level) => acc + (level.sessionsCount || 0),
                        0
                      ) || 0
                    }
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              */}
              {mode !== formMode.view && (
                <Button
                  type="button"
                  className="mt-2"
                  onClick={() =>
                    append({
                      name: '',
                      description: '',
                      price: 0,
                      sessionsDiortion: 0,
                      sessionsCount: 0,
                    })
                  }
                >
                  <Plus className="h-4 w-4" /> {t('addCourseLevel')}
                </Button>
              )}
            </div>
          </div>

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>{t('description')}</FormLabel>
                <FormControl>
                  <Textarea className="md:col-span-2" placeholder={t('description')} {...field} />
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
