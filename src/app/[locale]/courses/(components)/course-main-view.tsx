'use client'

import { MainView } from '@/components/main-view'
import { ICourse } from './course.interface'
import { useCourseColumn } from './useCourseColumn'
import { routes } from '@/lib/const/routes.enum'
import { useTranslations } from 'next-intl'
import { CourseCard } from './course-card'

interface CourseMainViewProps {
  data: ICourse[]
}
export const CourseMainView = ({ data }: CourseMainViewProps) => {
  const t = useTranslations('course')
  const columns = useCourseColumn()
  const renderCard = (item: ICourse, idx: number) => <CourseCard course={item} idx={idx} />
  return (
    <MainView
      title={t('title')}
      columns={columns}
      data={data}
      mainRoute={routes.courses}
      renderCard={renderCard}
    />
  )
}
