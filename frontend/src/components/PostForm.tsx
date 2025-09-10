import { useState, useEffect } from 'react'
import type { Post, User, CreatePostData, UpdatePostData } from '../types'

interface PostFormProps {
  post?: Post
  users: User[]
  onSubmit: (data: CreatePostData | UpdatePostData) => Promise<Post | null>
  onCancel: () => void
  isLoading?: boolean
}

export const PostForm = ({
  post,
  users,
  onSubmit,
  onCancel,
  isLoading = false,
}: PostFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    userId: 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        userId: post.userId,
      })
    } else if (users.length > 0) {
      // Set first user as default for new posts
      setFormData((prev) => ({
        ...prev,
        userId: users[0].id,
      }))
    }
  }, [post, users])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.userId) {
      newErrors.userId = 'Please select a user'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const submitData = post
      ? { title: formData.title } // For updates, only send title
      : { title: formData.title, userId: formData.userId } // For creates, send both

    const result = await onSubmit(submitData)
    if (result) {
      onCancel() // Close form on success
    }
  }

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = field === 'userId' ? Number(e.target.value) : e.target.value

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))

      // Clear error for this field when user starts typing/selecting
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: '',
        }))
      }
    }

  const selectedUser = users.find((user) => user.id === formData.userId)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={handleInputChange('title')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter post title"
          disabled={isLoading}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title}</p>
        )}
      </div>

      {!post && ( // Only show user selection for new posts
        <div>
          <label
            htmlFor="userId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Author *
          </label>
          <select
            id="userId"
            value={formData.userId}
            onChange={handleInputChange('userId')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.userId ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          >
            <option value={0}>Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} (@{user.username})
              </option>
            ))}
          </select>
          {errors.userId && (
            <p className="mt-1 text-xs text-red-600">{errors.userId}</p>
          )}
        </div>
      )}

      {post &&
        selectedUser && ( // Show author info for existing posts
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
              <p className="text-sm text-gray-900">
                {selectedUser.name} (@{selectedUser.username})
              </p>
            </div>
          </div>
        )}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  )
}
