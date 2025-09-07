'use client'

import { MainView } from '@/components/main-view'
import { ICourseGroup } from './course-group.interface'
import { useCourseGroupColumn } from './useCourseGroupColumn'
import { routes } from '@/lib/const/routes.enum'
import { useTranslations } from 'next-intl'
import { CourseGroupCard } from './course-group-card'
// import {
//   closeGroup,
//   activateGroup,
//   deactivateGroup,
//   addExtraSession,
//   enrollGroup,
// } from '../course-group.action'
import { toast } from 'sonner'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { ActivateGroupModal } from './activate-group-modal'
import { useRouter } from '@/i18n/routing'

interface CourseGroupMainViewProps {
  data: ICourseGroup[]
}
export const CourseGroupMainView = ({ data }: CourseGroupMainViewProps) => {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ICourseGroup | null>(null)
  const t = useTranslations('courseGroup')
  const columns = useCourseGroupColumn()

  // Group actions for each row
  const extraActions = (item: ICourseGroup) => (
    <>
      {item.statusId !== 2 && (
        <div
          role="button"
          onClick={() => {
            router.push(`/${routes.courseGroups}/activate/${item.id}`)
          }}
          className="flex w-full items-center justify-between p-2 text-sm hover:bg-gray-100"
        >
          <span className="text-sm">{t('activate')}</span>
          <Check className="size-4" />
        </div>
      )}
      {item.statusId === 2 && (
        <div
          role="button"
          onClick={() => {
            router.push(`/${routes.courseGroups}/${item.id}/attendance`)
          }}
          className="flex w-full items-center justify-between p-2 text-sm hover:bg-gray-100"
        >
          <span className="text-sm">{t('manageAttendance')}</span>
          <Check className="size-4" />
        </div>
      )}
    </>
  )

  const renderCard = (item: ICourseGroup, idx: number) => (
    <CourseGroupCard courseGroup={item} idx={idx} />
  )
  return (
    <>
      <MainView
        title={t('title')}
        columns={columns}
        data={data}
        mainRoute={routes.courseGroups}
        renderCard={renderCard}
        extraActions={extraActions}
      />
      <ActivateGroupModal
        open={showModal}
        onClose={() => setShowModal(false)}
        group={selectedItem}
      />
    </>
  )
}
