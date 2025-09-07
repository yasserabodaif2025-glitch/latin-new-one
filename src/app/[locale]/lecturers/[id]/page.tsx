import { formMode } from '@/lib/const/form-mode.enum'
import { LecturerForm } from '../(components)/lecturer-form'
import { getLecturer } from '../lecturer.action'

export default async function ViewLecturerPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const lecturer = await getLecturer(id)

  return <LecturerForm data={lecturer} mode={formMode.view} />
}
