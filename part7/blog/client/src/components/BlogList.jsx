import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  return (
    <>
      <h2>Blogs</h2>
      {blogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <ul>
          {blogs.map((blog) => (
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default BlogList

BlogList.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.object).isRequired,
}
