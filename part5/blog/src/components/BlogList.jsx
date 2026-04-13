import PropTypes from 'prop-types'
import Blog from './Blog'

const BlogList = ({ blogs, updateBlog, deleteBlog, canDelete }) => {
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  return (
    <>
      <h1>blogs</h1>
      {sortedBlogs.map((blog) => (
        <Blog
          blog={blog}
          key={blog.id}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
          canDelete={canDelete(blog.user.username)}
        />
      ))}
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
