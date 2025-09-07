import { formMode } from '@/lib/const/form-mode.enum'
import { QualificationIssuerForm } from '../../(components)/qualification-issuer-form'
import { getQualificationIssuer } from '../../qualification-issuer.action'

export default async function EditQualificationIssuerPage({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params
  const qualificationIssuer = await getQualificationIssuer(id)

  return <QualificationIssuerForm data={qualificationIssuer} mode={formMode.edit} />
}
