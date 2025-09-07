import { ActivateGroupModal } from '../../../(components)/activate-group-modal'
import { getCourseGroup } from '../../../course-group.action'

export default async function ActivateCourseGroupModal({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params
  const data = await getCourseGroup(id)
  return <ActivateGroupModal open={true} group={data} />
}
