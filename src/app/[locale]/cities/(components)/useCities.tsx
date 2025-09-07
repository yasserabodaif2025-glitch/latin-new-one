import { useEffect, useState } from 'react'
import { getCities } from '../city.action'
import { ICity } from './city.interface'

export const useCities = () => {
  const [cities, setCities] = useState<ICity[]>([])
  useEffect(() => {
    const fetchCities = async () => {
      const cities = await getCities()
      setCities(cities.data)
    }
    fetchCities()
    return () => {
      setCities([])
    }
  }, [])
  return cities
}
