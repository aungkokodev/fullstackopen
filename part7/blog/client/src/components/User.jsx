import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useBlog } from '../stores/blog'
import { List, ListItem, ListItemText } from '@mui/material'

const User = ({ user }) => {
  const blogs = useBlog()

  if (!user) return null

  const userBlog = {
    ...user,
    blogs: blogs.filter((b) => b.user.id === user.id),
  }

  return (
    <div>
      <h2>{userBlog.name}</h2>
      <p>added blogs</p>
      <List>
        {userBlog.blogs.map((blog) => (
          <ListItem key={blog.id} sx={{ padding: 0 }}>
            <ListItemText>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default User

User.propTypes = {
  user: PropTypes.object,
}
