import useSWR from 'swr'
import { axiosFetcher } from '@/lib/swr-fetchers'
import { ISalaryType } from '../interface/salary-type.interface'

export const useSalaryTypes = () => {
  const { data, error, isLoading } = useSWR<ISalaryType[]>(
    '/api/SalaryTypes',
    axiosFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // cache لمدة دقيقة واحدة للبيانات الثابتة
    }
  )

  return {
    salaryTypes: data || [],
    isLoading,
    error,
  }
}