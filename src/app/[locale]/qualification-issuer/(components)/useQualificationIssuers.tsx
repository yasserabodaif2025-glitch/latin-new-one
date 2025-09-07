import useSWR from 'swr'
import { axiosFetcher } from '@/lib/swr-fetchers'
import { IQualificationIssuer } from './qualification-issuer.interface'
import { IResponse } from '@/lib/AbstractApi'
import { apis } from '@/lib/const/api.enum'

export const useQualificationIssuers = () => {
  const { data, error, isLoading, mutate } = useSWR<IResponse<IQualificationIssuer[]>>(
    `${apis.qualificationIssuer}/${apis.pagination}`,
    axiosFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // cache لمدة دقيقة للبيانات الثابتة
    }
  )

  return {
    qualificationIssuers: data?.data || [],
    isLoading,
    error,
    mutate,
  }
}