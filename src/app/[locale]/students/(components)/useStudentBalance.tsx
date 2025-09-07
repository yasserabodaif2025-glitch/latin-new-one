import useSWR from 'swr'
import { axiosFetcher } from '@/lib/swr-fetchers'
import { IStudentBalance } from '../../receipts/(components)/receipt.interface'

export const useStudentBalance = (studentId: number | null) => {
  const { data, error, isLoading, mutate } = useSWR<IStudentBalance[]>(
    studentId ? `FinancialOperations/student/balances/${studentId}` : null,
    axiosFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 10000, // cache لمدة 10 ثواني للبيانات المالية
      errorRetryCount: 1,
    }
  )

  return {
    balances: data || [],
    isLoading,
    error,
    mutate,
  }
}