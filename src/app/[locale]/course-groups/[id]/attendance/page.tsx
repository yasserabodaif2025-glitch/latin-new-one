import { getCourseGroup } from '../../course-group.action'
import { AttendanceMainView } from './(components)/attendance-main-view'

export default async function AttendancePage({ params }: any) {
  const group = await getCourseGroup(params.id)

  return <AttendanceMainView group={group} />
}
