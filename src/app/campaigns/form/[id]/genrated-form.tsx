'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCampaignCourses } from './useCampaignCourses'
import { useCampaignBranches } from './useCamapginBranches'
import { AppSelect } from '@/components/ui/app-select'
import { DatePicker } from '@/components/ui/date-picker'
import { createLead } from './lead-campaign.action'
import { toast } from 'sonner'

export const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  birthdate: z.date(),
  courseId: z.number(),
  branchId: z.number(),
})

type Props = {
  referenceId: string
}

export const GenratedForm = ({ referenceId }: Props) => {
  const { courses } = useCampaignCourses(referenceId)
  const { branches } = useCampaignBranches(referenceId)

  const defaultValues = {
    name: '',
    email: '',
    phone: '',
    birthdate: new Date(),
    courseId: 0,
    branchId: 0,
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })
  const { control, handleSubmit, formState } = form
  const router = useRouter()

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      toast.info('اتمام التسجيل بنجاح')
      await createLead(data)
      toast.success('تم إرسال الطلب بنجاح')
      router.push(`/campaigns/form/${referenceId}/thank-you`)
    } catch (error) {
      console.log(error)
      toast.error('حدث خطأ ما')
    }
  }

  return (
    <Form {...form}>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel>الاسم</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel>الايميل</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="birthdate"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>تاريخ الميلاد</FormLabel>
                <FormControl>
                  <DatePicker
                    btnClassName="w-full"
                    className="w-full"
                    value={field.value as Date}
                    onChange={(e) => {
                      field.onChange(e)
                    }}
                    isRTL={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel>الهاتف</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="branchId"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel>الفرع</FormLabel>
                <FormControl>
                  <AppSelect
                    options={branches?.map((branch) => ({
                      value: branch.id,
                      label: branch.name,
                    }))}
                    value={field.value}
                    onChangeValue={(value) => {
                      field.onChange(value as number)
                    }}
                    placeholder="الفرع"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="courseId"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel>الكورس</FormLabel>
                <FormControl>
                  <AppSelect
                    options={courses?.map((course) => ({
                      value: course.id,
                      label: course.name,
                    }))}
                    value={field.value}
                    onChangeValue={(value) => {
                      field.onChange(value as number)
                    }}
                    placeholder="الكورس"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="mt-4 px-20">
          ارسال
        </Button>
      </form>
    </Form>
  )
}
