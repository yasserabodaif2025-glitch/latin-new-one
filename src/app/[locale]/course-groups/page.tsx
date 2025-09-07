'use client'

import { CourseGroupMainView } from './(components)/course-group-main-view'
import { useCourseGroup } from './(components)/useCourseGroup'

export default function CourseGroupsPage() {
  const { courseGroups, isLoading, error } = useCourseGroup()
  
  if (isLoading) {
    return <div className="flex items-center justify-center p-8">جاري التحميل...</div>
  }
  
  if (error) {
    return <div className="flex items-center justify-center p-8 text-red-500">خطأ في تحميل البيانات</div>
  }
  
  return <CourseGroupMainView data={courseGroups} />
}
