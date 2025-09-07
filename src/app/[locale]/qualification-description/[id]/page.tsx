import { QualificationDescriptionForm } from '../(components)/qualification-description-form'
import { formMode } from '@/lib/const/form-mode.enum'
import { getQualificationDescription } from '../qualification-description.action'

export default async function ViewQualificationDescriptionPage({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params
  const qualificationDescription = await getQualificationDescription(id)

  return <QualificationDescriptionForm data={qualificationDescription} mode={formMode.view} />
}
