import { formMode } from '@/lib/const/form-mode.enum'
import { AreaForm } from '../../(components)'
import { getArea } from '../../area.action'

export default async function EditAreaPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params

  const area = await getArea(id)

  return <AreaForm data={area} mode={formMode.edit} />
}
