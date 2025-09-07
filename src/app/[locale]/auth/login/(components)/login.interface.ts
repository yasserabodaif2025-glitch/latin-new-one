export interface LoginResponse {
  accessToken: string
  refreshToken: string
  accessTokenExpires: string
  refreshTokenExpires: string
  userId: number
  userName: string
  roles: string[]
}

export interface LoginRequest {
  userNameOrEmail: string
  password: string
}
