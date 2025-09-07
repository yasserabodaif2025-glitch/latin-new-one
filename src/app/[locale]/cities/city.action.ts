'use server'

import { apis } from '@/lib/const/api.enum'
import { ICity } from './(components)'
import { CitySchema } from '@/lib/schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'

const url = `${apis.cities}`

export async function getCities() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<ICity[]>
}

export async function getCity(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as ICity
}

export async function createCity(data: CitySchema) {
  const res = await axiosInstance.post(url, data)
  return res.data as ICity
}

export async function updateCity(id: number, data: CitySchema) {
  const res = await axiosInstance.put(`${url}/${id}`, data)
  return res.data as ICity
}

export async function deleteCity(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreCity(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as ICity
}
