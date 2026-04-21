import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'
import { useEffect } from 'react'
import { Link, Route, Routes, useMatch, useNavigate } from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import ErrorBoundary from './components/ErrorBoundary'
import LoginForm from './components/LoginForm'
import NotFound from './components/NotFound'
import Notification from './components/Notificatioin'
import UserList from './components/UserList'
import { useBlog, useBlogActions } from './stores/blog'
import { useLogin, useLoginActions } from './stores/login'
import { useNotificationActions } from './stores/notification'

const App = () => {
  const user = useLogin()
  const loginActions = useLoginActions()
  const blogs = useBlog()
  const blogActions = useBlogActions()
  const { notify } = useNotificationActions()

  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')

  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  const handleLogin = async (username, password) => {
    await loginActions.login({ username, password })
  }

  const handleLogout = async () => {
    await loginActions.logout()
    navigate('/')
  }

  const createBlog = async (blog) => {
    try {
      await blogActions.create(blog)
      notify(`a new blog ${blog.title} by ${blog.author} added`)
    } catch (error) {
      notify(error.response.data.error, true)
      throw new Error()
    }
  }

  const updateBlog = async (blog) => {
    try {
      await blogActions.like(blog)
    } catch (error) {
      notify(error.response.data.error, true)
    }
  }

  const deleteBlog = async (blog) => {
    try {
      await blogActions.remove(blog.id)
      notify(`Successfully deleted ${blog.title} by ${blog.author}`)
      navigate('/')
    } catch (error) {
      notify(error.response.data.error, true)
    }
  }

  useEffect(() => {
    blogActions.initialize()
    loginActions.initialize()
  }, [])

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography
            component={'h1'}
            sx={{
              flexGrow: 1,
            }}
          >
            Blog App
          </Typography>
          <nav>
            <Button color="inherit" component={Link} to="/">
              blogs
            </Button>
            <Button color="inherit" component={Link} to="/users">
              users
            </Button>
            {user && (
              <Button
                color="inherit"
                component={Link}
                to="/create"
                nativeButton={false}
              >
                new blog
              </Button>
            )}
            {user ? (
              <Button color="inherit" onClick={handleLogout}>
                logout
              </Button>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                login
              </Button>
            )}
          </nav>
        </Toolbar>
      </AppBar>
      <Notification />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<BlogList blogs={blogs} />} />
          <Route path="/users" element={<UserList />} />
          {user && (
            <Route
              path="/create"
              element={<BlogForm createBlog={createBlog} />}
            />
          )}
          {!user && (
            <Route
              path="/login"
              element={<LoginForm handleLogin={handleLogin} />}
            />
          )}
          <Route
            path="/blogs/:id"
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
