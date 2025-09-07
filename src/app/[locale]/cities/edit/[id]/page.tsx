import { formMode } from '@/lib/const/form-mode.enum'
import { CityForm } from '../../(components)'
import { getCity } from '../../city.action'

export default async function EditCityPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params

  const city = await getCity(id)

  return <CityForm data={city} mode={formMode.edit} />
}
