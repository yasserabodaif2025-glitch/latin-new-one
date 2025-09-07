import React from 'react'
import { routes } from '@/lib/const/routes.enum'
import { DeleteModal } from '@/components/table/delete-modal'
import { deleteCampaign } from '../../../campaign.action'

export default function DeleteCampaignPage() {
  return <DeleteModal route={routes.campaigns} action={deleteCampaign} />
}
