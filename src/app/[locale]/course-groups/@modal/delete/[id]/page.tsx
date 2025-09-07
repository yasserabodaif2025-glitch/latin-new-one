import { DeleteModal } from '@/components/table'
import { routes } from '@/lib/const/routes.enum'
import { deleteCourseGroup } from '../../../course-group.action'
export default function DeleteCourseGroupModal() {
  return <DeleteModal route={routes.courseGroups} action={deleteCourseGroup} />
}
