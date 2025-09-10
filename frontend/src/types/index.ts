// API Response Types
export interface User {
  id: number
  name: string
  username: string
  email: string
}

export interface Post {
  id: number
  userId: number
  title: string
}

// Form Types for Creating/Updating
export interface CreateUserData {
  name: string
  username: string
  email: string
}

export interface UpdateUserData {
  name?: string
  username?: string
  email?: string
}

export interface CreatePostData {
  userId: number
  title: string
}

export interface UpdatePostData {
  title?: string
}

// API Error Types
export interface ApiError {
  message: string
  status?: number
}
