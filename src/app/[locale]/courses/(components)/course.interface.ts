import { ICategory } from '../../categories/(components)'

export interface ICourse {
  id: number
  name: string
  description: string
  categoryId: number
  category: ICategory
  isActive: boolean
  levels: ICoueseLevel[]
  categoryName: string
}

export interface ICoueseLevel {
  id: number
  courseId: number
  name: string
  description: string
  price: number
  sessionsDiortion: number
  sessionsCount: number
}
