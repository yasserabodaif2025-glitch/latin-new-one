import { formMode } from '@/lib/const/form-mode.enum'
import { CampaignForm } from '../(components)'
import { getCampaign } from '../campaign.action'

export default async function CampaignDetailPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string; id: number }>
}>) {
  const { id } = await params
  const campaign = await getCampaign(id)
  return <CampaignForm data={campaign} mode={formMode.view} />
}
