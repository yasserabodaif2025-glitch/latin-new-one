'use client'

import { LabTable } from './(components)'
import { useLabs } from './(components)/useLabs'

export default function LabsPage() {
  const { labs, isLoading } = useLabs()
  
  if (isLoading) {
    return <div className="flex items-center justify-center p-8">جاري التحميل...</div>
  }
  
  return <LabTable data={labs} />
}
