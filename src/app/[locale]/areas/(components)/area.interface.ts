import { ICity } from '../../cities/(components)'

export interface IArea {
  id: number
  name: string
  description: string
  cityId: number
  cityName: string
  city: ICity
}
