import { formMode } from '@/lib/const/form-mode.enum'
import { QualificationTypeForm } from '../../(components)/qualification-type-form'
import { getQualificationType } from '../../qualification-type.action'

export default async function EditQualificationTypePage({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params
  const qualificationType = await getQualificationType(id)

  return <QualificationTypeForm data={qualificationType} mode={formMode.edit} />
}
