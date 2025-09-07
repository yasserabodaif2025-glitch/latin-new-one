'use client'

import { studentSchema, StudentSchema } from '@/lib/schema/student.schema'
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
import { formMode } from '@/lib/const/form-mode.enum'
import { routes } from '@/lib/const/routes.enum'
import { useLocale, useTranslations } from 'next-intl'
import { IStudent } from '.'
import {
  createStudent,
  updateStudent,
  getStudentBalance,
  getStudentPaymentHistory,
  getSessionsPage,
} from '../student.action'
import { useAgreements } from '../../agreements/(components)/useAgreement'
import { useQualificationDescriptions } from '../../qualification-description/(components)/useQualificationDescription'
import { useQualificationTypes } from '../../qualification-type/(components)/useQualificationTypes'
import { useQualificationIssuers } from '../../qualification-issuer/(components)/useQualificationIssuers'
import { useAreas } from '../../areas/(components)/useAreas'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { BookingModal } from './booking-modal'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IStudentBalance } from '../../receipts/(components)/receipt.interface'

type Props = {
  mode?: formMode
  data?: IStudent
}

export const StudentForm = ({ mode = formMode.create, data }: Props) => {
  const locale = useLocale()
  const t = useTranslations('student')
  const areas = useAreas()
  const studentSources = useAgreements()
  const { qualificationDescriptions } = useQualificationDescriptions()
  const { qualificationTypes } = useQualificationTypes()
  const { qualificationIssuers } = useQualificationIssuers()

  const defaultValues: StudentSchema = {
    id: data?.id ? data.id : undefined,
    name: data?.name ?? '',
    email: data?.email ?? '',
    phone: data?.phone ?? '',
    address: data?.address ?? '',
    areaId: data?.areaId ?? 0,
    birthdate: data?.birthdate ? new Date(data.birthdate) : new Date(),
    educationalQualificationDescriptionId: data?.educationalQualificationDescriptionId ?? 0,
    educationalQualificationTypeId: data?.educationalQualificationTypeId ?? 0,
    educationalQualificationIssuerId: data?.educationalQualificationIssuerId ?? 0,
    studentSourceId: data?.studentSourceId ?? 0,
  }
  const router = useRouter()
  const methods = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
    defaultValues,
    disabled: mode === formMode.view,
  })

  const { control, handleSubmit, reset } = methods
  const [balances, setBalances] = React.useState<IStudentBalance[]>([])
  const [payments, setPayments] = React.useState<any[] | null>(null)
  const [paymentsLoading, setPaymentsLoading] = React.useState(false)
  const [attendance, setAttendance] = React.useState<Record<number, { loading: boolean; items: any[] | null }>>({})

  const onSubmit = async (values: StudentSchema) => {
    try {
      toast.info(t('creating'))
      if (mode === formMode.edit && data?.id) {
        await updateStudent(data?.id ?? 0, values)
        toast.success(t('editSuccess'))
      } else {
        await createStudent(values)
        toast.success(t('addSuccess'))
      }
      router.push(`/${routes.students}`)
    } catch (error) {
      console.error(error)
    }
  }

  const loadBalances = React.useCallback(async () => {
    if (!data?.id) return
    try {
      const res = await getStudentBalance(data.id)
      setBalances(res ?? [])
    } catch (err) {
      console.error('loadBalances', err)
    }
  }, [data])

  React.useEffect(() => {
    // load balances when viewing or editing an existing student
    if (mode !== formMode.create && data?.id) loadBalances()
  }, [mode, data, loadBalances])

  const handleOpenReceipts = async () => {
    if (!data?.id) return
    if (payments !== null) return
    try {
      setPaymentsLoading(true)
      const res = await getStudentPaymentHistory(data.id)
      setPayments(Array.isArray(res) ? res : res?.data ?? [])
    } catch (err) {
      console.error('getStudentPaymentHistory', err)
    } finally {
      setPaymentsLoading(false)
    }
  }

  const handleOpenAttendance = async (enrollmentId: number, groupName?: string) => {
    if (!enrollmentId || !groupName) return
    const cached = attendance[enrollmentId]
    if (cached && (cached.items || cached.loading)) return
    setAttendance((s) => ({ ...s, [enrollmentId]: { loading: true, items: null } }))
    try {
      const res = await getSessionsPage({ Limit: 100, FreeText: groupName })
      const items = Array.isArray(res) ? res : res?.data ?? []
      setAttendance((s) => ({ ...s, [enrollmentId]: { loading: false, items } }))
    } catch (err) {
      console.error('getSessionsPage', err)
      setAttendance((s) => ({ ...s, [enrollmentId]: { loading: false, items: [] } }))
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
              <Link href={`/${routes.students}`}>
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
            name="areaId"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>{t('areaId')}</FormLabel>
                <FormControl>
                  <Select value={field.value + ''} onValueChange={(e) => field.onChange(+e)}>
                    <SelectTrigger disabled={mode === formMode.view}>
                      <SelectValue placeholder={t('areaPlaceholder')} />
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
            name="birthdate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('birthdate')}</FormLabel>
                <FormControl>
                  <DatePicker
                    isRTL={locale === 'ar'}
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

          <FormField
            control={control}
            name="educationalQualificationDescriptionId"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>{t('educationalQualificationDescriptionId')}</FormLabel>
                <FormControl>
                  <Select value={field.value + ''} onValueChange={(e) => field.onChange(+e)}>
                    <SelectTrigger disabled={mode === formMode.view}>
                      <SelectValue
                        placeholder={t('educationalQualificationDescriptionPlaceholder')}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {qualificationDescriptions?.map((qualificationDescription) => (
                        <SelectItem
                          key={qualificationDescription.id}
                          value={qualificationDescription.id + ''}
                        >
                          {qualificationDescription.name}
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
              <FormItem className="">
                <FormLabel>{t('educationalQualificationIssuerId')}</FormLabel>
                <FormControl>
                  <Select value={field.value + ''} onValueChange={(e) => field.onChange(+e)}>
                    <SelectTrigger disabled={mode === formMode.view}>
                      <SelectValue placeholder={t('educationalQualificationIssuerPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {qualificationIssuers?.map((qualificationIssuer) => (
                        <SelectItem
                          key={qualificationIssuer.id}
                          value={qualificationIssuer.id + ''}
                        >
                          {qualificationIssuer.name}
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
              <FormItem className="">
                <FormLabel>{t('educationalQualificationTypeId')}</FormLabel>
                <FormControl>
                  <Select value={field.value + ''} onValueChange={(e) => field.onChange(+e)}>
                    <SelectTrigger disabled={mode === formMode.view}>
                      <SelectValue placeholder={t('educationalQualificationTypePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {qualificationTypes?.map((qualificationType) => (
                        <SelectItem key={qualificationType.id} value={qualificationType.id + ''}>
                          {qualificationType.name}
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
              <FormItem className="">
                <FormLabel>{t('studentSourceId')}</FormLabel>
                <FormControl>
                  <Select value={field.value + ''} onValueChange={(e) => field.onChange(+e)}>
                    <SelectTrigger disabled={mode === formMode.view}>
                      <SelectValue placeholder={t('studentSourcePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {studentSources?.map((studentSource) => (
                        <SelectItem key={studentSource.id} value={studentSource.id + ''}>
                          {studentSource.name}
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

        {/* Enrollments & Balances panel */}
        {mode !== formMode.create && data?.id && (
          <div className="mt-6 rounded-xl border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium">{t('enrollments')}</h4>
              <div>
                <BookingModal studentId={data.id} />
              </div>
            </div>

            <div className="mt-3">
              {balances.length === 0 ? (
                <div className="text-sm text-muted-foreground">{t('noEnrollments')}</div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {balances.map((b) => {
                    const itemId = `${b.enrollmentId}`
                    return (
                      <AccordionItem key={itemId} value={itemId} className="border px-2">
                        <AccordionTrigger className="text-start">
                          <div className="flex w-full items-center justify-between gap-2">
                            <div className="text-sm">
                              <div className="font-medium">
                                {b.groupName}
                                {b.courseName ? ` — ${b.courseName}` : ''}
                                {b.levelName ? ` — ${b.levelName}` : ''}
                              </div>
                            </div>
                            <div className="text-xs md:text-sm">
                              <span className="text-muted-foreground">المتبقي: </span>
                              <span className="font-semibold">{b.remainingBalance ?? 0}</span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="mb-3">
                              <TabsTrigger value="overview">ملخص</TabsTrigger>
                              <TabsTrigger
                                value="attendance"
                                onClick={() => handleOpenAttendance(b.enrollmentId, b.groupName)}
                              >
                                الحضور
                              </TabsTrigger>
                              <TabsTrigger value="receipts" onClick={handleOpenReceipts}>
                                الإيصالات
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview">
                              <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                                <div>
                                  <div className="text-muted-foreground">إجمالي الرسوم</div>
                                  <div className="font-medium">{b.totalFee ?? 0}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">المدفوع</div>
                                  <div className="font-medium">{b.paidAmount ?? 0}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">المتبقي</div>
                                  <div className="font-medium">{b.remainingBalance ?? 0}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">الخصم</div>
                                  <div className="font-medium">{b.discount ?? 0}</div>
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="attendance">
                              {attendance[b.enrollmentId]?.loading ? (
                                <div className="rounded-md border p-3 text-sm text-muted-foreground">جارٍ التحميل...</div>
                              ) : attendance[b.enrollmentId]?.items && attendance[b.enrollmentId]?.items!.length > 0 ? (
                                <div className="overflow-x-auto rounded-md border">
                                  <table className="min-w-full text-sm">
                                    <thead className="bg-muted/40 text-xs">
                                      <tr>
                                        <th className="px-3 py-2 text-start">التاريخ</th>
                                        <th className="px-3 py-2 text-start">الحالة</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {attendance[b.enrollmentId]!.items!.map((s, idx) => {
                                        const present = Array.isArray(s?.studentsPresent)
                                          ? s.studentsPresent.some((st: any) => st.studentId === data?.id)
                                          : false
                                        const absent = Array.isArray(s?.studentsAbsent)
                                          ? s.studentsAbsent.some((st: any) => st.studentId === data?.id)
                                          : false
                                        const status = present ? 'حاضر' : absent ? 'غائب' : '—'
                                        const date = typeof s?.startTime === 'string' ? s.startTime.split('T')[0] : '-'
                                        return (
                                          <tr key={s.id ?? idx} className="border-t">
                                            <td className="px-3 py-2">{date}</td>
                                            <td className="px-3 py-2">{status}</td>
                                          </tr>
                                        )
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="rounded-md border p-3 text-sm text-muted-foreground">لا توجد جلسات.</div>
                              )}
                            </TabsContent>
                            <TabsContent value="receipts">
                              {(() => {
                                const groupPayments = (payments ?? []).filter((p: any) =>
                                  p?.enrollmentId === b.enrollmentId ||
                                  p?.courseEnrollmentId === b.enrollmentId ||
                                  (p?.groupName && p.groupName === b.groupName)
                                )
                                const totalPaid = groupPayments.reduce((s: number, p: any) => s + (Number(p?.amount) || 0), 0)
                                const required = (Number(b.totalFee) || 0) - (Number(b.discount) || 0)
                                return paymentsLoading ? (
                                  <div className="rounded-md border p-3 text-sm text-muted-foreground">جارٍ التحميل...</div>
                                ) : groupPayments.length > 0 ? (
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-3 text-sm md:grid-cols-3">
                                      <div>
                                        <div className="text-muted-foreground">المطلوب</div>
                                        <div className="font-medium">{required}</div>
                                      </div>
                                      <div>
                                        <div className="text-muted-foreground">المدفوع (هذه المجموعة)</div>
                                        <div className="font-medium">{totalPaid}</div>
                                      </div>
                                      <div>
                                        <div className="text-muted-foreground">المتبقي</div>
                                        <div className="font-medium">{b.remainingBalance ?? 0}</div>
                                      </div>
                                    </div>
                                    <div className="overflow-x-auto rounded-md border">
                                      <table className="min-w-full text-sm">
                                        <thead className="bg-muted/40 text-xs">
                                          <tr>
                                            <th className="px-3 py-2 text-start">التاريخ</th>
                                            <th className="px-3 py-2 text-start">المبلغ</th>
                                            <th className="px-3 py-2 text-start">طريقة الدفع</th>
                                            <th className="px-3 py-2 text-start">ملاحظات</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {groupPayments.map((p: any, idx: number) => (
                                            <tr key={p.id ?? idx} className="border-t">
                                              <td className="px-3 py-2">{p.paymentDate?.split('T')[0] ?? p.date?.split('T')[0] ?? '-'}</td>
                                              <td className="px-3 py-2">{p.amount ?? '-'}</td>
                                              <td className="px-3 py-2">{p.paymentMethod ?? '-'}</td>
                                              <td className="px-3 py-2">{p.notes ?? p.description ?? '-'}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="rounded-md border p-3 text-sm text-muted-foreground">لا توجد إيصالات لهذه المجموعة.</div>
                                )
                              })()}
                            </TabsContent>
                          </Tabs>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              )}
            </div>
          </div>
        )}
      </form>
    </Form>
  )
}
