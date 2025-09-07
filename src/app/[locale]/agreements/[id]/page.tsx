import { AgreementForm } from '../(components)/agreement-form'
import { formMode } from '@/lib/const/form-mode.enum'
import { getAgreement } from '../agreement.action'

export default async function ViewAgreementPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const agreement = await getAgreement(id)

  return <AgreementForm data={agreement} mode={formMode.view} />
}
