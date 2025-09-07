import { SWRConfig } from 'swr'
import { fetcher } from '@/lib/swr-fetchers'

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        dedupingInterval: 10000, // زيادة فترة deduping لتقليل الطلبات المكررة
        errorRetryCount: 1, // تقليل عدد المحاولات
        errorRetryInterval: 5000, // زيادة الفترة بين المحاولات
        shouldRetryOnError: (error) => {
          // عدم إعادة المحاولة في حالة 401, 403, 404
          if (error?.status === 401 || error?.status === 403 || error?.status === 404) {
            return false
          }
          return true
        },
        provider: () => new Map(),
        // إضافة cache للبيانات الثابتة
        refreshInterval: 0, // إيقاف التحديث التلقائي
        focusThrottleInterval: 5000, // تقليل تكرار التحديث عند التركيز
      }}
    >
      {children}
    </SWRConfig>
  )
}