import { AreaForm } from '../(components)'
import { formMode } from '@/lib/const/form-mode.enum'
import { getArea } from '../area.action'

export default async function ViewAreaPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const area = await getArea(id)

  return <AreaForm data={area} mode={formMode.view} />
}
