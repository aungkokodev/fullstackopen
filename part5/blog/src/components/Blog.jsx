import PropTypes from 'prop-types'
import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, canDelete }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggle = () => setShowDetails(!showDetails)

  const buttonLabel = showDetails ? 'hide' : 'view'

  const blogStyle = {
    border: '1px solid #333',
    padding: '8px 4px',
    marginBottom: 8,
  }

  const deleteBtnStyle = {
    border: 0,
    outline: 0,
    marginTop: 4,
    padding: '4px 8px',
    background: '#f00',
    color: '#fff',
  }

  const handleBlogUpdate = () => {
    const blogToUpdate = {
      user: blog.user.id,
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }
    updateBlog(blogToUpdate)
  }

  const handleBlogDelete = () => {
    const ok = window.confirm(`Remove ${blog.title} by ${blog.author}`)
    if (ok) deleteBlog(blog)
  }

  const visibleWhenView = {
    display: showDetails ? '' : 'none',
  }

  return (
    <div
      style={blogStyle}
      className="blog"
    >
      <div className="blog-title">
        {blog.title} {blog.author}{' '}
        <button onClick={toggle}>{buttonLabel}</button>
      </div>
      <div
        style={visibleWhenView}
        className="blog-details"
      >
        <div className="blog-url">{blog.url}</div>
        <div className="blog-likes">
          likes {blog.likes} <button onClick={handleBlogUpdate}>like</button>
        </div>
        <div className="blog-user">{blog.user.name}</div>
        {canDelete && (
          <button
            style={deleteBtnStyle}
            onClick={handleBlogDelete}
          >
            delete
          </button>
        )}
      </div>
    </div>
  )
}

export default Blog

Blog.propTypes = {
  blog: PropTypes.object,
  updateBlog: PropTypes.func,
  deleteBlog: PropTypes.func,
  canDelete: PropTypes.bool,
}
