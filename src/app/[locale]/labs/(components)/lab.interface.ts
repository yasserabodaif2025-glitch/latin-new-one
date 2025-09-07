export interface ILab {
  id: number
  name: string
  //   description: string
  capacity: number
  type: string
  branchId: number
  branchName: string
}

export interface ILabType {
  id: number
  name: string
}
