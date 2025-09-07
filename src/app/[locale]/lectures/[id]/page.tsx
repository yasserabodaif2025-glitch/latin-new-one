import { LectureForm } from '../(components)'
import { formMode } from '@/lib/const/form-mode.enum'

async function fetchLecture(id: number) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/lectures/${id}`)
  return res.json()
}

export default async function ViewLecturePage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const category = await fetchLecture(id)

  return (
    <>
      <LectureForm data={category} mode={formMode.view} />
    </>
  )
}
