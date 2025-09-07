'use client'

import { AgreementTable } from './(components)/agreement-table'
import { useAgreements } from './(components)/useAgreement'

export default function AgreementsPage() {
  const { agreements, isLoading, error } = useAgreements()
  
  if (isLoading) {
    return <div className="flex items-center justify-center p-8">جاري التحميل...</div>
  }
  
  if (error) {
    return <div className="flex items-center justify-center p-8 text-red-500">خطأ في تحميل البيانات</div>
  }
  
  return <AgreementTable data={agreements} />
}
