import { ICourse } from '../../courses/(components)/course.interface'
import { ILab } from '../../labs/(components)/lab.interface'
import { ILecturer } from '../../lecturers/(components)/lecturer.interface'
import { ILecture } from '../../lectures/(components)'
import { IStudent } from '../../students/(components)/student.interface'

export interface ICourseGroup {
  id: number
  applicationId: string
  name: string
  startDate: string
  endDate: string
  instructorId: number
  courseId: number
  branchId: number
  statusId: number
  studentIds: number[]
  students: IStudent[]
  levelId: number
  roomId: number
  days: number[] | string
  daysArray: number[]
  course: ICourse
  instructor: ILecturer
  room: ILab
  roomName: string
  instructorName: string
  startTime: string
  endTime: string
  price: number
  sessions: ILecture[]
  levelName: string
  levelCode: string
  levelDuration: number
  levelSessionsCount: number
  levelPrice: number
}

export interface ICourseGroupStatus {
  id: number
  name: string
}

export interface ICourseGroupDay {
  id: number
  name: string
}

export interface ICampaignLead {
  name: string
  email: string
  phone: string
  address: string
  areaId: number
  birthdate: string
  courseId: number
  branchId: number
}
