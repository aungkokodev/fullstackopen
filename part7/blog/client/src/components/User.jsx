import PropTypes from 'prop-types'
import { useBlog } from '../stores/blog'

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
      <ul>
        {userBlog.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User

User.propTypes = {
  user: PropTypes.object,
}
