import axios from 'axios'
import type { AxiosResponse, AxiosError } from 'axios'
import type {
  User,
  Post,
  CreateUserData,
  UpdateUserData,
  CreatePostData,
  UpdatePostData,
  ApiError,
} from '../types'
import { toast } from 'sonner'

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  // timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Generic error handler
const handleApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    // Server responded with error status
    const errorData = error.response.data as { message?: string } | undefined
    return {
      message:
        errorData?.message ||
        `Request failed with status ${error.response.status}`,
      status: error.response.status,
    }
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'No response from server. Please check your connection.',
    }
  } else {
    // Request setup error
    return {
      message: error.message || 'An unexpected error occurred',
    }
  }
}

// Users API
export const usersApi = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    try {
      const response: AxiosResponse<User[]> = await apiClient.get('/users')
      return response.data
    } catch (error) {
      throw handleApiError(error as AxiosError)
    }
  },

  // Get user by ID
  getById: async (id: number): Promise<User> => {
    try {
      const response: AxiosResponse<User> = await apiClient.get(`/users/${id}`)
      return response.data
    } catch (error) {
      throw handleApiError(error as AxiosError)
    }
  },

  // Create new user
  create: async (userData: CreateUserData): Promise<User> => {
    try {
      const response: AxiosResponse<User> = await apiClient.post(
        '/users',
        userData
      )
      toast.success('User created successfully')
      return response.data
    } catch (error) {
      toast.error('Failed to create user')
      throw handleApiError(error as AxiosError)
    }
  },

  // Update user
  update: async (id: number, userData: UpdateUserData): Promise<User> => {
    try {
      const response: AxiosResponse<User> = await apiClient.patch(
        `/users/${id}`,
        userData
      )
      toast.success('User updated successfully')
      return response.data
    } catch (error) {
      toast.error('Failed to update user')
      throw handleApiError(error as AxiosError)
    }
  },

  // Delete user
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/users/${id}`)
      toast.success('User deleted successfully')
    } catch (error) {
      toast.error('Failed to delete user')
      throw handleApiError(error as AxiosError)
    }
  },
}

// Posts API
export const postsApi = {
  // Get all posts
  getAll: async (): Promise<Post[]> => {
    try {
      const response: AxiosResponse<Post[]> = await apiClient.get('/posts')
      return response.data
    } catch (error) {
      throw handleApiError(error as AxiosError)
    }
  },

  // Get posts by user ID
  getByUserId: async (userId: number): Promise<Post[]> => {
    try {
      const response: AxiosResponse<Post[]> = await apiClient.get(
        `/users/${userId}/posts`
      )
      return response.data
    } catch (error) {
      throw handleApiError(error as AxiosError)
    }
  },

  // Get post by ID
  getById: async (id: number): Promise<Post> => {
    try {
      const response: AxiosResponse<Post> = await apiClient.get(`/posts/${id}`)
      return response.data
    } catch (error) {
      throw handleApiError(error as AxiosError)
    }
  },

  // Create new post
  create: async (postData: CreatePostData): Promise<Post> => {
    try {
      const response: AxiosResponse<Post> = await apiClient.post(
        '/posts',
        postData
      )
      toast.success('Post created successfully')
      return response.data
    } catch (error) {
      toast.error('Failed to create post')
      throw handleApiError(error as AxiosError)
    }
  },

  // Update post
  update: async (id: number, postData: UpdatePostData): Promise<Post> => {
    try {
      const response: AxiosResponse<Post> = await apiClient.patch(
        `/posts/${id}`,
        postData
      )
      toast.success('Post updated successfully')
      return response.data
    } catch (error) {
      toast.error('Failed to update post')
      throw handleApiError(error as AxiosError)
    }
  },

  // Delete post
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/posts/${id}`)
      toast.success('Post deleted successfully')
    } catch (error) {
      toast.error('Failed to delete post')
      throw handleApiError(error as AxiosError)
    }
  },
}

export default apiClient
