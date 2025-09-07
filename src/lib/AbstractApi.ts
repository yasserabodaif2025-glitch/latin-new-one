import { axiosInstance } from './axiosInstance'
import { apis } from './const/api.enum'

export abstract class AbstractApi<T, S> {
  protected readonly api: string
  constructor(api: apis) {
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
}

export interface IResponse<T> {
  data: T
  total?: number
}
