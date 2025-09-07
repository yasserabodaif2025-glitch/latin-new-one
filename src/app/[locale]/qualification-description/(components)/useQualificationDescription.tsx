import useSWR from 'swr'
import { axiosFetcher } from '@/lib/swr-fetchers'
import { IQualificationDescription } from './qualification-description.interface'
import { IResponse } from '@/lib/AbstractApi'
import { apis } from '@/lib/const/api.enum'

export const useQualificationDescriptions = () => {
  const { data, error, isLoading, mutate } = useSWR<IResponse<IQualificationDescription[]>>(
    `${apis.qualificationDescription}/${apis.pagination}`,
    axiosFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // cache لمدة دقيقة للبيانات الثابتة
    }
  )

  return {
    qualificationDescriptions: data?.data || [],
    isLoading,
    error,
    mutate,
  }
}