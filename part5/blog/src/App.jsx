import { useEffect, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Notification from './components/Notificatioin'
import blogService from './services/blog'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (username, password) => {
    const user = await loginService.login({
      username,
      password,
    })
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    blogService.setToken(user.token)
    setUser(user)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const displayNotification = (msg, err = false) => {
    setMessage(msg)
    setIsError(err)
    setTimeout(() => {
      setMessage('')
      setIsError(false)
    }, 5000)
  }

  // const blogFormRef = useRef()

  // const createBlog = async (blog) => {
  //   try {
  //     const newBlog = await blogService.create(blog)
  //     setBlogs((b) => b.concat(newBlog))
  //     blogFormRef.current.toggleVisibility()
  //     displayNotification(`a new blog ${blog.title} by ${blog.author} added`)
  //   } catch (error) {
  //     displayNotification(error.response.data.error, true)
  //   }
  // }

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
        `Successfully deleted ${blog.title} by ${blog.author}`,
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

  const canDelete = (username) => {
    if (!user || user?.username !== username) return false
    return true
  }

  const padding = {
    padding: 8,
  }

  const loginLink =
    user ?
      <button onClick={handleLogout}>logout</button>
      // eslint-disable-next-line indent
    : <Link to='/login' style={padding}>
        login
      </Link>

  return (
    <>
      <nav>
        <Link to='/' style={padding}>
          blogs
        </Link>
        {loginLink}
      </nav>

      <Notification message={message} isError={isError} />

      <Routes>
        <Route
          path='/'
          element={
            <BlogList
              blogs={blogs}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              canDelete={canDelete}
            />
          }
        />
        <Route
          path='/login'
          element={
            <LoginForm
              handleLogin={handleLogin}
              displayNotification={displayNotification}
            />
          }
        />
      </Routes>

      {/* <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable> */}
    </>
  )
}

export default App
