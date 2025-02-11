import { useState } from 'react'

const Blog = ({ blog, updateBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggle = () => setShowDetails(!showDetails)

  const buttonLabel = showDetails ? 'hide' : 'view'

  const blogStyle = {
    border: '1px solid #333',
    padding: '8px 4px',
    marginBottom: 8,
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

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggle}>{buttonLabel}</button>
      </div>
      {showDetails && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button onClick={handleBlogUpdate}>like</button>
          </div>
          <div>{blog.user.name}</div>
        </div>
      )}
    </div>
  )
}

export default Blog
