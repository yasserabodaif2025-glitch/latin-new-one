export interface Instructor {
  instructorId: number
  name: string
  email: string
}

export interface Level {
  id: number
  name: string
}

export interface InstructorsLevelsResponse {
  instructors: Instructor[]
  levels: Level[]
}
