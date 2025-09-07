import { IStudent } from '../../students/(components)'

export interface ILecture {
  id: number
  roomId: number
  instructorId: number
  startTime: Date | string
  groupId: number
  notes: string
  students: SessionStudent[]
  groupStudents: IStudent[]
  groupName: string
  instructorName: string
  roomName: string
}

export interface SessionStudent {
  studentId: number
  studentName: string
  studentPhone: string
  isPresent: boolean
  notes: string
}

export interface TodaySessions {
  instructor: string
  room: string
  course: string
  level: string
  group: string
  startTime: string
  endTime: string
  id: number
  roomId: number
}
