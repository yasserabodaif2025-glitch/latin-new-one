import { CityTable } from './(components)'
import { getCities } from './city.action'

export default async function CitiesPage() {
  const cities = await getCities()
  return <CityTable data={cities.data} />
}
