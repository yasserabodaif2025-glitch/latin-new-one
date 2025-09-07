import { CityForm } from '../(components)'
import { formMode } from '@/lib/const/form-mode.enum'
import { getCity } from '../city.action'

export default async function ViewCityPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const category = await getCity(id)

  return <CityForm data={category} mode={formMode.view} />
}
