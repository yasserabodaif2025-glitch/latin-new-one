import { Suspense } from 'react'
import { GroupsScheduleTable } from './(components)'
import { getActiveGroups, IGroupScheduleItem } from './groups-schedule.action'
import { Loader2 } from 'lucide-react'

export default async function GroupsSchedulePage() {
  let initialGroups: IGroupScheduleItem[] = []
  
  try {
    const groupsResponse = await getActiveGroups()
    initialGroups = groupsResponse.data || []
  } catch (error) {
    console.error('Error loading initial groups:', error)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">جدول المجموعات</h1>
        <p className="text-muted-foreground mt-2">
          عرض جميع المجموعات النشطة في جدول أسبوعي مع إمكانية الفلترة
        </p>
      </div>
      
      <Suspense 
        fallback={
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="mr-2">جاري تحميل جدول المجموعات...</span>
          </div>
        }
      >
        <GroupsScheduleTable initialGroups={initialGroups} />
      </Suspense>
    </div>
  )
}
