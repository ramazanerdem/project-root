import { useState, useEffect, useCallback } from 'react'
import { usersApi } from '../services/api'
import type { User, CreateUserData, UpdateUserData, ApiError } from '../types'

interface UseUsersState {
  users: User[]
  loading: boolean
  error: string | null
  creating: boolean
  updating: boolean
  deleting: boolean
}

interface UseUsersActions {
  refreshUsers: () => Promise<void>
  createUser: (userData: CreateUserData) => Promise<User | null>
  updateUser: (id: number, userData: UpdateUserData) => Promise<User | null>
  deleteUser: (id: number) => Promise<boolean>
  clearError: () => void
}

export const useUsers = (): UseUsersState & UseUsersActions => {
  const [state, setState] = useState<UseUsersState>({
    users: [],
    loading: false,
    error: null,
    creating: false,
    updating: false,
    deleting: false,
  })

  // Fetch users from API
  const refreshUsers = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const users = await usersApi.getAll()
      console.log('Fetched users:', users)
      setState((prev) => ({
        ...prev,
        users,
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

  // Create a new user
  const createUser = useCallback(
    async (userData: CreateUserData): Promise<User | null> => {
      setState((prev) => ({ ...prev, creating: true, error: null }))

      try {
        const newUser = await usersApi.create(userData)
        setState((prev) => ({
          ...prev,
          users: [...prev.users, newUser],
          creating: false,
          error: null,
        }))
        return newUser
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

  // Update an existing user
  const updateUser = useCallback(
    async (id: number, userData: UpdateUserData): Promise<User | null> => {
      setState((prev) => ({ ...prev, updating: true, error: null }))

      try {
        const updatedUser = await usersApi.update(id, userData)
        setState((prev) => ({
          ...prev,
          users: prev.users.map((user) =>
            user.id === id ? updatedUser : user
          ),
          updating: false,
          error: null,
        }))
        return updatedUser
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

  // Delete a user
  const deleteUser = useCallback(async (id: number): Promise<boolean> => {
    setState((prev) => ({ ...prev, deleting: true, error: null }))

    try {
      await usersApi.delete(id)
      setState((prev) => ({
        ...prev,
        users: prev.users.filter((user) => user.id !== id),
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

  // Load users on mount
  useEffect(() => {
    refreshUsers()
  }, [refreshUsers])

  return {
    // State
    users: state.users,
    loading: state.loading,
    error: state.error,
    creating: state.creating,
    updating: state.updating,
    deleting: state.deleting,
    // Actions
    refreshUsers,
    createUser,
    updateUser,
    deleteUser,
    clearError,
  }
}
