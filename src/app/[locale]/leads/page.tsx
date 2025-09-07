'use client'

import { LeadTable } from './(components)'
import { useLeads } from './(components)/useLeads'

export default function LeadsPage() {
  const { leads, isLoading, error } = useLeads()
  
  if (isLoading) {
    return <div className="flex items-center justify-center p-8">جاري التحميل...</div>
  }
  
  if (error) {
    return <div className="flex items-center justify-center p-8 text-red-500">خطأ في تحميل البيانات</div>
  }
  
  return <LeadTable data={leads} />
}
