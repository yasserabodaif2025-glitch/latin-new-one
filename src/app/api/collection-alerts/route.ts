import { NextResponse } from 'next/server'
import { axiosInstance } from '@/lib/axiosInstance'
import { apis } from '@/lib/const/api.enum'
import { CollectionAlert } from '@/lib/api/collection-notifications.service'

export async function GET() {
  try {
    // الحصول على التوكن من الكوكيز
    const { getToken } = await import('@/app/[locale]/auth/token.action')
    const token = await getToken()

    // الحصول على تنبيهات التحصيل مباشرة من نقطة النهاية الجديدة
    const { data } = await axiosInstance.get<CollectionAlert>(
      `${apis.receipts}/collection-alerts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error in collection alerts API:', error)

    // إعادة نفس رسالة الخطأ من الخادم الرئيسي
    return NextResponse.json(
      {
        error: error.response?.data?.message || 'Failed to fetch collection alerts',
        status: error.response?.status || 500,
      },
      {
        status: error.response?.status || 500,
      }
    )
  }
}
