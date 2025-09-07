import { LabForm } from '../(components)'
import { formMode } from '@/lib/const/form-mode.enum'
import { getLab } from '../lab.action'

export default async function ViewLabPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const lab = await getLab(id)

  return <LabForm data={lab} mode={formMode.view} />
}
