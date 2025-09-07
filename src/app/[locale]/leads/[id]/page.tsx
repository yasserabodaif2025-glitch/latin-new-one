import { LeadForm } from '../(components)'
import { formMode } from '@/lib/const/form-mode.enum'
import { getLead } from '../lead.action'

export default async function ViewLeadPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const lead = await getLead(id)

  return <LeadForm data={lead} mode={formMode.view} />
}
