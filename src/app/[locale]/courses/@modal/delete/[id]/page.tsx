import React from 'react'
import { routes } from '@/lib/const/routes.enum'
import { DeleteModal } from '@/components/table'
import { deleteCourse } from '../../../course.action'

export default function DeleteCoursePage() {
  return <DeleteModal route={routes.courses} action={deleteCourse} />
}
