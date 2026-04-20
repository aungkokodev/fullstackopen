import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, Route, Routes, useMatch, useNavigate } from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Notification from './components/Notificatioin'
import blogService from './services/blog'
import loginService from './services/login'
import ErrorBoundary from './components/ErrorBoundary'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')

  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

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
    console.log('before')
    navigate('/')
    console.log('after')
  }

  const displayNotification = (msg, err = false) => {
    setMessage(msg)
    setIsError(err)
    setTimeout(() => {
      setMessage('')
      setIsError(false)
    }, 5000)
  }

  const createBlog = async (blog) => {
    try {
      const newBlog = await blogService.create(blog)
      setBlogs((b) => b.concat(newBlog))
      displayNotification(`a new blog ${blog.title} by ${blog.author} added`)
    } catch (error) {
      displayNotification(error.response.data.error, true)
      throw new Error()
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
        `Successfully deleted ${blog.title} by ${blog.author}`,
      )
      navigate('/')
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

  return (
    <Container>
      <AppBar position='static'>
        <Toolbar>
          <Typography component={'h1'} sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <nav>
            <Button color='inherit' component={Link} to='/'>
              blogs
            </Button>
            {user && (
              <Button
                color='inherit'
                component={Link}
                to='/create'
                nativeButton={false}
              >
                new blog
              </Button>
            )}
            {
              user ?
                <Button color='inherit' onClick={handleLogout}>
                  logout
                </Button>
                // eslint-disable-next-line indent
              : <Button color='inherit' component={Link} to='/login'>
                  login
                </Button>

            }
          </nav>
        </Toolbar>
      </AppBar>
      <Notification message={message} isError={isError} />
      <ErrorBoundary>
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
          {user && (
            <Route
              path='/create'
              element={<BlogForm createBlog={createBlog} />}
            />
          )}
          {!user && (
            <Route
              path='/login'
              element={
                <LoginForm
                  handleLogin={handleLogin}
                  displayNotification={displayNotification}
                />
              }
            />
          )}
          <Route
            path='/blogs/:id'
            element={
              <Blog
                blog={blog}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
                canDelete={user?.username === blog?.user.username}
                canLike={!!user}
              />
            }
          />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
