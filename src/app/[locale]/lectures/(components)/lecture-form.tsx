'use client'

import { lectureSchema, LectureSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Link, useRouter } from '@/i18n/routing'
import { toast } from 'sonner'
import { useLocale, useTranslations } from 'next-intl'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AttendsFormTable } from './attends-form-table'
import { DatePicker } from '@/components/ui/date-picker'
import { ILecture } from './lecture.interface'
import { useCourseGroup } from '../../course-groups/(components)/useCourseGroup'
import { useLecturers } from '../../lecturers/(components)/useLecturers'
import { useLabs } from '../../labs/(components)/useLabs'
import { createLecture, updateLecture } from '../lecture.action'
type Props = {
  mode?: formMode
  data?: ILecture
}

export const LectureForm = ({ mode = formMode.create, data }: Props) => {
  console.log({ data })
  const locale = useLocale()
  const t = useTranslations('lecture')
  const { courseGroups } = useCourseGroup()
  const { lecturers } = useLecturers()
  const { labs } = useLabs()
  const [selected, setSelected] = React.useState<Record<number, boolean>>(
    Object.fromEntries(data?.students?.map((student) => [student.studentId, false]) ?? [])
  )

  console.log(data?.groupStudents)
  const router = useRouter()
  const defaultValues: LectureSchema = {
    id: data?.id,
    roomId: data?.roomId ?? 0,
    instructorId: data?.instructorId ?? 0,
    startTime: data?.startTime ? new Date(data?.startTime) : new Date(),
    sessionStudents:
      data?.groupStudents.map((student) => ({
        studentId: student.id,
        isPresent: false,
        name: student.name,
        phone: student.phone,
        notes: '',
      })) ?? [],
    groupId: data?.groupId ?? 0,
    notes: data?.notes ?? '',
  }

  const methods = useForm<LectureSchema>({
    resolver: zodResolver(lectureSchema),
    defaultValues,
    disabled: mode === formMode.view,
  })

  const { control, handleSubmit, reset, setValue } = methods

  const { fields, append, update } = useFieldArray({
    control,
    name: 'sessionStudents',
  })

  useEffect(() => {
    fields.forEach((field, index) => {
      if (selected[index] !== field.isPresent) {
        update(index, {
          isPresent: selected[index] ? true : false,
          name: field.name,
          notes: field.notes,
          phone: field.phone,
          studentId: field.studentId,
        })
      }
    })
  }, [selected, fields, update])

  // useEffect(() => {
  //   if (data?.groupId && courseGroups) {
  //     const selectedGroup = courseGroups?.find((group) => group.id + '' === data.groupId + '')
  //     const groupStudents =
  //       selectedGroup?.students.map((student) => {
  //         return { id: student.id + '', name: student.name, phone: student.phone }
  //       }) ?? []
  //     setValue('instructorId', selectedGroup?.instructorId ?? 0)
  //     setValue('roomId', selectedGroup?.roomId ?? 0)
  //     append(
  //       groupStudents.map((student) => ({
  //         studentId: +student.id,
  //         isPresent: false,
  //         name: student.name,
  //         phone: student.phone,
  //         notes: '',
  //       }))
  //     )
  //   }
  // }, [data?.groupId, courseGroups, append])

  const onSubmit = async (values: LectureSchema) => {
    try {
      toast.info(t('creating'))
      if (mode === formMode.edit && data?.id) {
        await updateLecture(data.id, values)
        toast.success(t('editSuccess'))
      } else {
        await createLecture(values)
        toast.success(t('addSuccess'))
      }
      reset(defaultValues)
      router.push(`/${routes.lectures}`)
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
              <Link href={`/${routes.lectures}`}>
                <Button type="button" variant={'destructive'} size={'sm'}>
                  {t('cancel')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-4 rounded-lg border bg-white p-4 shadow-lg">
          <FormField
            control={control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('startDate')}</FormLabel>
                <FormControl>
                  <DatePicker
                    disabled
                    isRTL={locale === 'ar'}
                    className="w-full"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="groupId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('group')}</FormLabel>
                <FormControl>
                  <Select
                    disabled
                    value={field.value + ''}
                    onValueChange={(e) => {
                      const selectedGroup = courseGroups?.find((group) => group.id + '' === e + '')
                      const groupStudents =
                        selectedGroup?.students.map((student) => {
                          return { id: student.id + '', name: student.name, phone: student.phone }
                        }) ?? []
                      setValue('instructorId', selectedGroup?.instructorId ?? 0)
                      setValue('roomId', selectedGroup?.roomId ?? 0)
                      append(
                        groupStudents.map((student) => ({
                          studentId: +student.id,
                          isPresent: false,
                          notes: '',
                          name: student.name,
                          phone: student.phone,
                        }))
                      )

                      field.onChange(+e)
                    }}
                  >
                    <SelectTrigger disabled={mode === formMode.view}>
                      <SelectValue placeholder={t('selectGroupPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {courseGroups?.map((group) => (
                          <SelectItem key={group.id} value={group.id + ''}>
                            {group.name}
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
            name="roomId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('lab')}</FormLabel>
                <FormControl>
                  <Select
                    disabled={mode === formMode.view}
                    value={field.value + ''}
                    onValueChange={(e) => field.onChange(+e)}
                  >
                    <SelectTrigger disabled={mode === formMode.view}>
                      <SelectValue placeholder={t('selectLabPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {labs?.map((lab) => (
                          <SelectItem key={lab.id} value={lab.id + ''}>
                            {lab.name}
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
            name="instructorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('lecturer')}</FormLabel>
                <FormControl>
                  <Select
                    disabled={mode === formMode.view}
                    value={field.value + ''}
                    onValueChange={(e) => {
                      field.onChange(+e)
                    }}
                  >
                    <SelectTrigger disabled={mode === formMode.view}>
                      <SelectValue placeholder={t('selectLecturerPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {lecturers?.map((lecturer) => (
                          <SelectItem key={lecturer.id} value={lecturer.id + ''}>
                            {lecturer.name}
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

        <div className="mt-3 grid grid-cols-1 gap-4 rounded-xl border bg-white p-4 shadow-lg">
          {fields.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold">{t('attends')}</h3>
              <AttendsFormTable data={fields} setSelected={setSelected} selected={selected} />
            </div>
          )}

          <FormField
            control={control}
            name="notes"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>{t('notes')}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t('notes')} {...field} />
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
