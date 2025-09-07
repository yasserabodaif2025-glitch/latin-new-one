import { axiosInstance } from './axiosInstance'
import { apis } from './const/api.enum'

export abstract class AbstractApi<T, S> {
  protected readonly api: string
  constructor(api: apis | string) {
    this.api = api
  }

  async getAll() {
    return (await axiosInstance.get(`${this.api}/${apis.pagination}`)).data as IResponse<T[]>
  }

  async getOne(id: number) {
    return (await axiosInstance.get(`${this.api}/${id}`)).data.data as T
  }

  async create(data: S) {
    return (await axiosInstance.post(this.api, data)).data as T
  }

  async update(id: number, data: S) {
    return (await axiosInstance.put(`${this.api}/${id}`, data)).data as T
  }

  async delete(id: number) {
    return axiosInstance.delete(this.api + id)
  }

  async restore(id: number) {
    return (await axiosInstance.put(this.api + apis.restore + id)).data as T
  }

  protected async get(endpoint: string) {
    return (await axiosInstance.get(`${this.api}${endpoint}`)).data
  }

  protected async post(endpoint: string, data?: any) {
    return (await axiosInstance.post(`${this.api}${endpoint}`, data)).data
  }

  protected async put(endpoint: string, data?: any) {
    return (await axiosInstance.put(`${this.api}${endpoint}`, data)).data
  }
}

export interface IResponse<T> {
  data: T
  total?: number
}
