'use client'

import { CampaignTable } from './(components)'
import { useCampaigns } from './(components)/useCampaigns'

export default function CampaignPage() {
  const { campaigns, isLoading, error } = useCampaigns()
  
  if (isLoading) {
    return <div className="flex items-center justify-center p-8">جاري التحميل...</div>
  }
  
  if (error) {
    return <div className="flex items-center justify-center p-8 text-red-500">خطأ في تحميل البيانات</div>
  }
  
  return <CampaignTable data={campaigns} />
}
