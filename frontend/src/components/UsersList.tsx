import { useState } from 'react'
import { Modal } from './Modal'
import { UserForm } from './UserForm'
import { LoadingSpinner } from './LoadingSpinner'
import type { User, CreateUserData, UpdateUserData } from '../types'

interface UsersListProps {
  users: User[]
  loading: boolean
  creating: boolean
  updating: boolean
  deleting: boolean
  onCreateUser: (data: CreateUserData) => Promise<User | null>
  onUpdateUser: (id: number, data: UpdateUserData) => Promise<User | null>
  onDeleteUser: (id: number) => Promise<boolean>
  onRefresh: () => Promise<void>
}

export const UsersList = ({
  users,
  loading,
  creating,
  updating,
  deleting,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  onRefresh,
}: UsersListProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null)

  const handleCreate = async (data: CreateUserData | UpdateUserData) => {
    const result = await onCreateUser(data as CreateUserData)
    if (result) {
      setShowCreateModal(false)
    }
    return result
  }

  const handleUpdate = async (data: CreateUserData | UpdateUserData) => {
    if (!editingUser) return null
    const result = await onUpdateUser(editingUser.id, data as UpdateUserData)
    if (result) {
      setEditingUser(null)
    }
    return result
  }

  const handleDelete = async (id: number) => {
    setDeletingUserId(id)
    const success = await onDeleteUser(id)
    setDeletingUserId(null)
    return success
  }

  const isUserBeingDeleted = (userId: number) => deletingUserId === userId

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Users</h2>
          <p className="text-sm text-gray-600">{users.length} users found</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Refresh'}
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add User
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && users.length === 0 && (
        <div className="text-center py-12">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && users.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-2.403a4 4 0 11-5.292 0M21 14a4 4 0 01-4 4h-.5c-.607 0-1.224-.103-1.79-.307M19.5 12c.621 0 1.125-.504 1.125-1.125v-1.25c0-.621-.504-1.125-1.125-1.125m-17.25 0c-.621 0-1.125.504-1.125 1.125v1.25c0 .621.504 1.125 1.125 1.125M8.25 14.25c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125s-.504 1.125-1.125 1.125H9.375c-.621 0-1.125-.504-1.125-1.125z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No users found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new user.
          </p>
        </div>
      )}

      {/* Users Table */}
      {users.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          @{user.username} • {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ID: {user.id}
                    </span>

                    {/* Action Buttons */}
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setEditingUser(user)}
                        disabled={updating}
                        className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none focus:text-blue-600 bg-blue-50 rounded-full"
                        title="Edit user"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deleting || isUserBeingDeleted(user.id)}
                        className="p-1 text-gray-400 hover:text-red-600 focus:outline-none focus:text-red-600 disabled:opacity-50 bg-red-50 rounded-full"
                        title="Delete user"
                      >
                        {isUserBeingDeleted(user.id) ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New User"
      >
        <UserForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          isLoading={creating}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={editingUser !== null}
        onClose={() => setEditingUser(null)}
        title="Edit User"
      >
        {editingUser && (
          <UserForm
            user={editingUser}
            onSubmit={handleUpdate}
            onCancel={() => setEditingUser(null)}
            isLoading={updating}
          />
        )}
      </Modal>
    </div>
  )
}
