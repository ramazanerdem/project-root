# User & Post Management Frontend

A clean, modern React application built with TypeScript and Tailwind CSS that provides complete CRUD (Create, Read, Update, Delete) operations for managing users and their posts.

## 🚀 Features

### User Management

- ✅ **View all users** - Display users in a clean, organized list
- ✅ **Create new users** - Add users with name, username, and email
- ✅ **Update user information** - Edit existing user details
- ✅ **Delete users** - Remove users from the system
- ✅ **Form validation** - Proper email validation and required field checks
- ✅ **Real-time loading states** - Visual feedback during operations

### Post Management

- ✅ **View all posts** - Display posts in a responsive card grid
- ✅ **Create new posts** - Add posts with title and author selection
- ✅ **Update post titles** - Edit existing post content
- ✅ **Delete posts** - Remove posts from the system
- ✅ **Filter by author** - View posts by specific users
- ✅ **Author information** - Show author details for each post

### Technical Features

- 🔧 **TypeScript** - Full type safety and better development experience
- 🎨 **Tailwind CSS & Shadcn/ui** - Modern, responsive UI design

- 🪝 **Custom React Hooks** - Reusable state management logic
- 🔄 **Error Handling** - Comprehensive error handling with user feedback
- ⚡ **Performance Optimized** - Efficient re-renders with proper dependency management
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- ♿ **Accessibility** - Proper ARIA labels and keyboard navigation

## 🏗️ Architecture

The application follows modern React best practices and microfrontend-compatible design patterns:

### Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/             # Shadcn/ui UI components
│   ├── Modal.tsx       # Generic modal component
│   ├── LoadingSpinner.tsx
│   ├── ErrorAlert.tsx
│   ├── UserForm.tsx    # User create/edit form
│   ├── PostForm.tsx    # Post create/edit form
│   ├── UsersList.tsx   # Users management interface
│   ├── PostsList.tsx   # Posts management interface
│   └── index.ts        # Component exports
├── hooks/              # Custom React hooks
│   ├── useUsers.ts     # User state management
│   └── usePosts.ts     # Post state management
├── services/           # API layer
│   └── api.ts          # HTTP client and API
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

### Design Patterns Used

1. **Custom Hooks Pattern**: Encapsulate business logic and state management
2. **Compound Component Pattern**: Modal and form components work together seamlessly
3. **Render Props Pattern**: Flexible component composition
4. **Error Boundary Pattern**: Graceful error handling
5. **Loading State Pattern**: Consistent loading indicators
6. **Optimistic Updates**: Immediate UI feedback with rollback on error

## 🛠️ Technology Stack

- **React 19** - Modern React with latest features
- **Vite** - Next Generation Frontend Tooling
- **TypeScript 5** - Type safety and developer experience
- **Tailwind CSS 4** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Vite** - Fast build tool and development server
- **ESLint** - Code quality and consistency

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API server running on `http://localhost:3000`

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ramazanerdem/project-root.git
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🔌 API Integration

The frontend connects to a REST API server running on `http://localhost:3000`. The API should provide the following endpoints:

### Users API

- `GET /users` - Get all users
- `POST /users` - Create a new user
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Posts API

- `GET /posts` - Get all posts
- `POST /posts` - Create a new post
- `GET /posts/:id` - Get post by ID
- `GET /users/:userId/posts` - Get posts by user
- `PATCH /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

### Example API Usage

**Create User:**

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "username": "johndoe", "email": "john@example.com"}'
```

**Create Post:**

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "title": "My First Post"}'
```

## 🎯 Key Features Demonstration

### 1. User Management

- Navigate to the "Users" tab
- Click "Add User" to create a new user
- Fill in the required fields (name, username, email)
- Use the edit button (pencil icon) to modify user details
- Use the delete button (trash icon) to remove users

### 2. Post Management

- Navigate to the "Posts" tab
- Click "Add Post" to create a new post
- Select an author and enter a title
- Use the filter dropdown to view posts by specific users
- Edit or delete posts using the action buttons

### 3. Error Handling

- The app gracefully handles network errors
- Form validation prevents invalid submissions
- Loading states provide visual feedback
- Error messages are displayed with dismissible alerts

## 🎨 UI/UX Features

- **Clean Design**: Modern, minimalist interface
- **Responsive Layout**: Works on all screen sizes
- **Loading States**: Visual feedback during operations
- **Error Messages**: Clear, actionable error information
- **Form Validation**: Real-time validation with helpful messages
- **Accessibility**: Keyboard navigation and screen reader support

## 🔧 Development Guidelines

### Code Organization

- Components are kept small and focused
- Custom hooks encapsulate business logic
- Types are centrally managed
- API calls are abstracted in service layer

### Performance Optimization

- `useCallback` prevents unnecessary re-renders
- Loading states prevent UI blocking
- Error boundaries catch and display errors gracefully
- Efficient state updates minimize renders

### TypeScript Best Practices

- Strict type checking enabled
- Interface segregation for better maintainability
- Generic types for reusable components
- Proper error type definitions

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using React + Vite + TypeScript + Tailwind CSS**
