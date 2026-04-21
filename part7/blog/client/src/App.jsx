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
import User from './components/User'
import { useUser, useUserActions } from './stores/user'

const App = () => {
  const auth = useLogin()
  const loginActions = useLoginActions()
  const blogs = useBlog()
  const blogActions = useBlogActions()
  const users = useUser()
  const userActions = useUserActions()
  const { notify } = useNotificationActions()

  const navigate = useNavigate()

  const matchBlog = useMatch('/blogs/:id')
  const blog = matchBlog
    ? blogs.find((blog) => blog.id === matchBlog.params.id)
    : null

  const matchUser = useMatch('/users/:id')
  const user = matchUser
    ? users.find((user) => user.id === matchUser.params.id)
    : null

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
    userActions.initialize()
  }, [blogActions, loginActions, userActions])

  useEffect(() => {})

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
            {auth && (
              <Button
                color="inherit"
                component={Link}
                to="/create"
                nativeButton={false}
              >
                new blog
              </Button>
            )}
            {auth ? (
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
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={blog}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
                canDelete={auth?.username === blog?.user.username}
                canLike={!!auth}
              />
            }
          />
          <Route path="/users" element={<UserList users={users} />} />
          <Route path="/users/:id" element={<User user={user} />} />
          {auth && (
            <Route
              path="/create"
              element={<BlogForm createBlog={createBlog} />}
            />
          )}
          {!auth && (
            <Route
              path="/login"
              element={<LoginForm handleLogin={handleLogin} />}
            />
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
