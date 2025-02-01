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
    setUser(user)
    setUsername('')
    setPassword('')
  }

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  return (
    <>
      {user === null ? (
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
      ) : (
        <div>
          <h1>blogs</h1>
          <p>{user.name} logged in</p>
          {blogs.map((blog) => (
            <Blog
              blog={blog}
              key={blog.id}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default App
