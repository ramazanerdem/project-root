import { useState } from 'react'
import { Modal } from './Modal'
import { PostForm } from './PostForm'
import { LoadingSpinner } from './LoadingSpinner'
import type { Post, User, CreatePostData, UpdatePostData } from '../types'

interface PostsListProps {
  posts: Post[]
  users: User[]
  loading: boolean
  creating: boolean
  updating: boolean
  deleting: boolean
  onCreatePost: (data: CreatePostData) => Promise<Post | null>
  onUpdatePost: (id: number, data: UpdatePostData) => Promise<Post | null>
  onDeletePost: (id: number) => Promise<boolean>
  onRefresh: () => Promise<void>
  onFilterByUser?: (userId: number) => Promise<void>
}

export const PostsList = ({
  posts,
  users,
  loading,
  creating,
  updating,
  deleting,
  onCreatePost,
  onUpdatePost,
  onDeletePost,
  onRefresh,
  onFilterByUser,
}: PostsListProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<number>(0)

  const handleCreate = async (data: CreatePostData | UpdatePostData) => {
    const result = await onCreatePost(data as CreatePostData)
    if (result) {
      setShowCreateModal(false)
    }
    return result
  }

  const handleUpdate = async (data: CreatePostData | UpdatePostData) => {
    if (!editingPost) return null
    const result = await onUpdatePost(editingPost.id, data as UpdatePostData)
    if (result) {
      setEditingPost(null)
    }
    return result
  }

  const handleDelete = async (id: number) => {
    setDeletingPostId(id)
    const success = await onDeletePost(id)
    setDeletingPostId(null)
    return success
  }

  const handleFilterByUser = async (userId: number) => {
    setSelectedUserId(userId)
    if (onFilterByUser && userId > 0) {
      await onFilterByUser(userId)
    } else {
      await onRefresh() // Show all posts
    }
  }

  const isPostBeingDeleted = (postId: number) => deletingPostId === postId

  const getUserName = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    return user ? `${user.name} (@${user.username})` : `User #${userId}`
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Posts</h2>
          <p className="text-sm text-gray-600">{posts.length} posts found</p>
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
            disabled={users.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            title={
              users.length === 0 ? 'Create users first' : 'Create new post'
            }
          >
            Add Post
          </button>
        </div>
      </div>

      {/* Filter by User */}
      {users.length > 0 && (
        <div className="flex items-center space-x-3">
          <label
            htmlFor="userFilter"
            className="text-sm font-medium text-gray-700"
          >
            Filter by user:
          </label>
          <select
            id="userFilter"
            value={selectedUserId}
            onChange={(e) => handleFilterByUser(Number(e.target.value))}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value={0}>All users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} (@{user.username})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Loading State */}
      {loading && posts.length === 0 && (
        <div className="text-center py-12">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && posts.length === 0 && (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No posts found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedUserId > 0
              ? 'This user has no posts yet.'
              : 'Get started by creating a new post.'}
          </p>
        </div>
      )}

      {/* Posts Grid */}
      {posts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    by {getUserName(post.userId)}
                  </p>
                </div>
                <div className="ml-3 flex items-center space-x-1">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    ID: {post.id}
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditingPost(post)}
                  disabled={updating}
                  className="p-2 text-gray-400 hover:text-blue-600 focus:outline-none focus:text-blue-600 rounded-md bg-blue-50 hover:bg-gray-100"
                  title="Edit post"
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
                  onClick={() => handleDelete(post.id)}
                  disabled={deleting || isPostBeingDeleted(post.id)}
                  className="p-2 text-gray-400 hover:text-red-600 focus:outline-none focus:text-red-600 disabled:opacity-50 rounded-md bg-red-50 hover:bg-gray-100"
                  title="Delete post"
                >
                  {isPostBeingDeleted(post.id) ? (
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
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Post"
      >
        <PostForm
          users={users}
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          isLoading={creating}
        />
      </Modal>

      {/* Edit Post Modal */}
      <Modal
        isOpen={editingPost !== null}
        onClose={() => setEditingPost(null)}
        title="Edit Post"
      >
        {editingPost && (
          <PostForm
            post={editingPost}
            users={users}
            onSubmit={handleUpdate}
            onCancel={() => setEditingPost(null)}
            isLoading={updating}
          />
        )}
      </Modal>
    </div>
  )
}
