import { useEffect, useState } from 'react'
import Blog from './components/Blog'
import blogService from './services/blog'
import loginService from './services/login'
import Notification from './components/Notificatioin'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

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
      setMessage(error.response.data.error)
      setIsError(true)
      setTimeout(() => {
        setMessage('')
        setIsError(false)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const createBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create({ title, author, url })
      setBlogs((b) => b.concat(newBlog))
      setMessage(`a new blog ${title} by ${author} added`)
      setTimeout(() => {
        setMessage('')
      }, 5000)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      setMessage(error.response.data.error)
      setIsError(true)
      setTimeout(() => {
        setMessage('')
        setIsError(false)
      }, 5000)
    }
  }

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

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
      <form onSubmit={createBlog}>
        <h1>create new</h1>
        <div>
          <label>title:</label>
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <label>author:</label>
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <label>url:</label>
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
      {blogs.map((blog) => (
        <Blog
          blog={blog}
          key={blog.id}
        />
      ))}
    </div>
  )
}

export default App
