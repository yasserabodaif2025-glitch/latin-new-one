import useSWR from 'swr'
import { axiosFetcher } from '@/lib/swr-fetchers'
import { IQualificationType } from './qualification-type.interface'
import { IResponse } from '@/lib/AbstractApi'
import { apis } from '@/lib/const/api.enum'

export const useQualificationTypes = () => {
  const { data, error, isLoading, mutate } = useSWR<IResponse<IQualificationType[]>>(
    `${apis.qualificationType}/${apis.pagination}`,
    axiosFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // cache لمدة دقيقة للبيانات الثابتة
    }
  )

  return {
    qualificationTypes: data?.data || [],
    isLoading,
    error,
    mutate,
  }
}