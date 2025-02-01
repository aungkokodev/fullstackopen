import { useEffect, useState } from 'react'
import Blog from './components/Blog'
import blogService from './services/blog'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    const user = await loginService.login({ username, password })
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    setUser(user)
    setUsername('')
    setPassword('')
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
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
      <div>
        {user.name} logged in{' '}
        <button
          type="button"
          onClick={handleLogout}
        >
          logout
        </button>
      </div>
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
