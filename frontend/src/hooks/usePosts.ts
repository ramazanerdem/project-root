import { useState, useEffect, useCallback } from 'react'
import { postsApi } from '../services/api'
import type { Post, CreatePostData, UpdatePostData, ApiError } from '../types'

interface UsePostsState {
  posts: Post[]
  loading: boolean
  error: string | null
  creating: boolean
  updating: boolean
  deleting: boolean
}

interface UsePostsActions {
  refreshPosts: () => Promise<void>
  createPost: (postData: CreatePostData) => Promise<Post | null>
  updatePost: (id: number, postData: UpdatePostData) => Promise<Post | null>
  deletePost: (id: number) => Promise<boolean>
  getPostsByUser: (userId: number) => Promise<void>
  clearError: () => void
}

export const usePosts = (): UsePostsState & UsePostsActions => {
  const [state, setState] = useState<UsePostsState>({
    posts: [],
    loading: false,
    error: null,
    creating: false,
    updating: false,
    deleting: false,
  })

  // Fetch all posts from API
  const refreshPosts = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const posts = await postsApi.getAll()
      setState((prev) => ({
        ...prev,
        posts,
        loading: false,
        error: null,
      }))
    } catch (error) {
      const apiError = error as ApiError
      setState((prev) => ({
        ...prev,
        loading: false,
        error: apiError.message,
      }))
    }
  }, [])

  // Fetch posts by user ID
  const getPostsByUser = useCallback(async (userId: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const posts = await postsApi.getByUserId(userId)
      setState((prev) => ({
        ...prev,
        posts,
        loading: false,
        error: null,
      }))
    } catch (error) {
      const apiError = error as ApiError
      setState((prev) => ({
        ...prev,
        loading: false,
        error: apiError.message,
      }))
    }
  }, [])

  // Create a new post
  const createPost = useCallback(
    async (postData: CreatePostData): Promise<Post | null> => {
      setState((prev) => ({ ...prev, creating: true, error: null }))

      try {
        const newPost = await postsApi.create(postData)
        setState((prev) => ({
          ...prev,
          posts: [...prev.posts, newPost],
          creating: false,
          error: null,
        }))
        return newPost
      } catch (error) {
        const apiError = error as ApiError
        setState((prev) => ({
          ...prev,
          creating: false,
          error: apiError.message,
        }))
        return null
      }
    },
    []
  )

  // Update an existing post
  const updatePost = useCallback(
    async (id: number, postData: UpdatePostData): Promise<Post | null> => {
      setState((prev) => ({ ...prev, updating: true, error: null }))

      try {
        const updatedPost = await postsApi.update(id, postData)
        setState((prev) => ({
          ...prev,
          posts: prev.posts.map((post) =>
            post.id === id ? updatedPost : post
          ),
          updating: false,
          error: null,
        }))
        return updatedPost
      } catch (error) {
        const apiError = error as ApiError
        setState((prev) => ({
          ...prev,
          updating: false,
          error: apiError.message,
        }))
        return null
      }
    },
    []
  )

  // Delete a post
  const deletePost = useCallback(async (id: number): Promise<boolean> => {
    setState((prev) => ({ ...prev, deleting: true, error: null }))

    try {
      await postsApi.delete(id)
      setState((prev) => ({
        ...prev,
        posts: prev.posts.filter((post) => post.id !== id),
        deleting: false,
        error: null,
      }))
      return true
    } catch (error) {
      const apiError = error as ApiError
      setState((prev) => ({
        ...prev,
        deleting: false,
        error: apiError.message,
      }))
      return false
    }
  }, [])

  // Clear error state
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  // Load posts on mount
  useEffect(() => {
    refreshPosts()
  }, [refreshPosts])

  return {
    // State
    posts: state.posts,
    loading: state.loading,
    error: state.error,
    creating: state.creating,
    updating: state.updating,
    deleting: state.deleting,
    // Actions
    refreshPosts,
    createPost,
    updatePost,
    deletePost,
    getPostsByUser,
    clearError,
  }
}
