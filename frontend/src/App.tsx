import { useState } from 'react'
import { useUsers } from './hooks/useUsers'
import { usePosts } from './hooks/usePosts'
import { UsersList, PostsList, ErrorAlert } from './components'

function App() {
  const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users')

  // Users hook
  const {
    users,
    loading: usersLoading,
    error: usersError,
    creating: usersCreating,
    updating: usersUpdating,
    deleting: usersDeleting,
    refreshUsers,
    createUser,
    updateUser,
    deleteUser,
    clearError: clearUsersError,
  } = useUsers()

  // Posts hook
  const {
    posts,
    loading: postsLoading,
    error: postsError,
    creating: postsCreating,
    updating: postsUpdating,
    deleting: postsDeleting,
    refreshPosts,
    createPost,
    updatePost,
    deletePost,
    getPostsByUser,
    clearError: clearPostsError,
  } = usePosts()

  const handleTabChange = (tab: 'users' | 'posts') => {
    setActiveTab(tab)
    // Clear errors when switching tabs
    if (tab === 'users') {
      clearPostsError()
    } else {
      clearUsersError()
    }
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                User & Post Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Simple CRUD operations for users and their posts with React,
                TypeScript, and Tailwind CSS, Nest.js, AWS EC2, nginx.
              </p>
            </div>
            <div className="flex md:items-center space-x-4 w-full md:w-auto">
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center space-x-1">
                  {usersError || postsError ? (
                    <>
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-600">API is Not Ready</span>
                    </>
                  ) : (
                    <>
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">API is Ready</span>
                    </>
                  )}
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  {users.length} Users, {posts.length} Posts
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => handleTabChange('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users
              {users.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {users.length}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabChange('posts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Posts
              {posts.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {posts.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="bg-white flex-1 py-6 px-4 sm:px-6 lg:px-8">
        {/* Error Alerts */}
        {usersError && activeTab === 'users' && (
          <ErrorAlert
            message={usersError}
            onDismiss={clearUsersError}
            className="mb-6"
          />
        )}
        {postsError && activeTab === 'posts' && (
          <ErrorAlert
            message={postsError}
            onDismiss={clearPostsError}
            className="mb-6"
          />
        )}

        {/* Tab Content */}
        {activeTab === 'users' ? (
          <UsersList
            users={users}
            loading={usersLoading}
            creating={usersCreating}
            updating={usersUpdating}
            deleting={usersDeleting}
            onCreateUser={createUser}
            onUpdateUser={updateUser}
            onDeleteUser={deleteUser}
            onRefresh={refreshUsers}
          />
        ) : (
          <PostsList
            posts={posts}
            users={users}
            loading={postsLoading}
            creating={postsCreating}
            updating={postsUpdating}
            deleting={postsDeleting}
            onCreatePost={createPost}
            onUpdatePost={updatePost}
            onDeletePost={deletePost}
            onRefresh={refreshPosts}
            onFilterByUser={getPostsByUser}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Built with React + Vite + TypeScript + Tailwind CSS • API endpoint:
            <code className="ml-1 px-1 py-0.5 bg-gray-100 rounded text-xs">
              http://localhost:3000
            </code>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
