'use client'

import useSWR from 'swr'
import { axiosFetcher } from '@/lib/swr-fetchers'
import { ILead } from './lead.interface'
import { IResponse } from '@/lib/AbstractApi'
import { apis } from '@/lib/const/api.enum'

export const useLeads = () => {
  const { data, error, isLoading, mutate } = useSWR<IResponse<ILead[]>>(
    `${apis.leads}/${apis.pagination}`,
    axiosFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 15000, // cache لمدة 15 ثانية للبيانات المتغيرة
      errorRetryCount: 1,
    }
  )

  return {
    leads: data?.data || [],
    isLoading,
    error,
    mutate,
  }
}