import { useEffect, useRef, useState } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notificatioin'
import Togglable from './components/Togglable'
import blogService from './services/blog'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const blogFormRef = useRef()

  const displayNotification = (msg, err = false) => {
    setMessage(msg)
    setIsError(err)
    setTimeout(() => {
      setMessage('')
      setIsError(false)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      displayNotification(error.response.data.error, true)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const createBlog = async (blog) => {
    try {
      const newBlog = await blogService.create(blog)
      setBlogs((b) => b.concat(newBlog))
      blogFormRef.current.toggleVisibility()
      displayNotification(`a new blog ${blog.title} by ${blog.author} added`)
    } catch (error) {
      displayNotification(error.response.data.error, true)
    }
  }

  const updateBlog = async (blog) => {
    try {
      const newBlog = await blogService.update(blog)
      const newBlogList = blogs.map((b) => (b.id === blog.id ? newBlog : b))
      setBlogs(newBlogList)
    } catch (error) {
      displayNotification(error.response.data.error, true)
    }
  }

  const deleteBlog = async (blog) => {
    try {
      await blogService.remove(blog.id)
      const newBlogList = blogs.filter((b) => b.id !== blog.id)
      setBlogs(newBlogList)
      displayNotification(
        `Successfully deleted ${blog.title} by ${blog.author}`
      )
    } catch (error) {
      displayNotification(error.response.data.error, true)
    }
  }

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))

    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  if (user === null)
    return (
      <div>
        <h1>log in to application</h1>
        <Notification
          message={message}
          isError={isError}
        />
        <form onSubmit={handleLogin}>
          <div>
            <label>username </label>
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label>password </label>
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )

  return (
    <div>
      <h1>blogs</h1>
      <Notification
        message={message}
        isError={isError}
      />
      <div>
        {user.name} logged in{' '}
        <button
          type="button"
          onClick={handleLogout}
        >
          logout
        </button>
      </div>
      <Togglable
        buttonLabel="create new blog"
        ref={blogFormRef}
      >
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {sortedBlogs.map((blog) => (
        <Blog
          blog={blog}
          key={blog.id}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
          canDelete={user.username === blog.user.username}
        />
      ))}
    </div>
  )
}

export default App
