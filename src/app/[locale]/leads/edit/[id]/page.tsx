import { formMode } from '@/lib/const/form-mode.enum'
import { LeadForm } from '../../(components)'
import { getLead } from '../../lead.action'

export default async function EditLeadPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const lead = await getLead(id)

  return <LeadForm data={lead} mode={formMode.edit} />
}
