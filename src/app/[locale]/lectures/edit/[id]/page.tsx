import { formMode } from '@/lib/const/form-mode.enum'
import { LectureForm } from '../../(components)'
import { getLecture } from '../../lecture.action'

export default async function EditLecturePage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params

  const lecture = await getLecture(id)

  return (
    <div>
      <LectureForm data={lecture} mode={formMode.edit} />
    </div>
  )
}
