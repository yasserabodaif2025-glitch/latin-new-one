export interface IMessageTemplate {
  id: number
  name: string
  sendAutomatically: boolean
  courseId: number
  body: string
  trigger: string
}
