export interface PublicUser {
  id: string
  name: string
  image: string | null
  nickname: string | null
  createdAt: string
  updatedAt: string
}

export interface CurrentUser extends PublicUser {
  email: string
}

export interface UsersResponse {
  users: PublicUser[]
}

export interface UserResponse {
  user: CurrentUser
}

export interface ApiError {
  error: string
  message: string
  status: number
}
