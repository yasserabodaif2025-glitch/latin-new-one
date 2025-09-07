import { AreaTable } from './(components)'
import { getAreas } from './area.action'

export default async function AreasPage() {
  const areas = await getAreas()
  return <AreaTable data={areas.data} />
}
