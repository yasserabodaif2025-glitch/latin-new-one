'use client'

import { LabTable } from './(components)'
import { useLabs } from './(components)/useLabs'

export default function LabsPage() {
  const { labs, isLoading, error } = useLabs()
  
  if (isLoading) {
    return <div className="flex items-center justify-center p-8">جاري التحميل...</div>
  }
  
  if (error) {
    return <div className="flex items-center justify-center p-8 text-red-500">خطأ في تحميل البيانات</div>
  }
  
  return <LabTable data={labs} />
}
