import { formMode } from '@/lib/const/form-mode.enum'
import { AgreementForm } from '../../(components)/agreement-form'
import { getAgreement } from '../../agreement.action'

export default async function EditAgreementPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const agreement = await getAgreement(id)

  return <AgreementForm data={agreement} mode={formMode.edit} />
}
