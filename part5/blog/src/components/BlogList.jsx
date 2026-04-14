import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs, updateBlog, deleteBlog, canDelete }) => {
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  return (
    <>
      <h2>blogs</h2>
      <ul>
        {sortedBlogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default BlogList

BlogList.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateBlog: PropTypes.func,
  deleteBlog: PropTypes.func,
  canDelete: PropTypes.func,
}
