import { QualificationTypeForm } from '../(components)/qualification-type-form'
import { formMode } from '@/lib/const/form-mode.enum'
import { getQualificationType } from '../qualification-type.action'

export default async function ViewQualificationTypePage({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params
  const qualificationType = await getQualificationType(id)

  return <QualificationTypeForm data={qualificationType} mode={formMode.view} />
}
