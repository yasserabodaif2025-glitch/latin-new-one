import React from 'react'
import { routes } from '@/lib/const/routes.enum'
import { DeleteModal } from '@/components/table/delete-modal'
import { deleteCity } from '../../../city.action'
export default function DeleteCityPage() {
  return <DeleteModal route={routes.cities} action={deleteCity} />
}
