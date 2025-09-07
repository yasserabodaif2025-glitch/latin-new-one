import useSWR from 'swr'
import { axiosFetcher } from '@/lib/swr-fetchers'
import { IStudent } from './student.interface'
import { IResponse } from '@/lib/AbstractApi'
import { apis } from '@/lib/const/api.enum'

export const useStudents = () => {
  const { data, error, isLoading, mutate } = useSWR<IResponse<IStudent[]>>(
    `${apis.students}/${apis.pagination}`,
    axiosFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 30000, // cache لمدة 30 ثانية
    }
  )

  return {
    students: data?.data || [],
    isLoading,
    error,
    mutate, // للتحديث اليدوي عند الحاجة
  }
}