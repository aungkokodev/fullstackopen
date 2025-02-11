import { useState } from 'react'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggle = () => setShowDetails(!showDetails)

  const buttonLabel = showDetails ? 'hide' : 'view'

  const blogStyle = {
    border: '1px solid #333',
    padding: '8px 4px',
    marginBottom: 8,
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
            likes {blog.likes} <button>like</button>
          </div>
          <div>{blog.user.name}</div>
        </div>
      )}
    </div>
  )
}

export default Blog
