'use client'

import { LecturerTable } from './(components)/lecturer-table'
import { useLecturers } from './(components)/useLecturers'

export default function LecturersPage() {
  const { lecturers, isLoading, error } = useLecturers()
  
  if (isLoading) {
    return <div className="flex items-center justify-center p-8">جاري التحميل...</div>
  }
  
  if (error) {
    return <div className="flex items-center justify-center p-8 text-red-500">خطأ في تحميل البيانات</div>
  }
  
  return <LecturerTable data={lecturers} />
}
