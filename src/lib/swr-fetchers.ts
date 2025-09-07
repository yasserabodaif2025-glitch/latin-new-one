import { axiosInstance } from './axiosInstance'

const fetcher = (...args: [string, RequestInit?]) => fetch(...args).then((res) => res.json())

const axiosFetcher = (url: string, config?: object) =>
  axiosInstance.get(url, config).then((response) => response.data)

export { fetcher, axiosFetcher }
