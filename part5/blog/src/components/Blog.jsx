import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog, canDelete, canLike }) => {
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

  if (!blog) return null

  return (
    <div className='blog'>
      <h2 className='blog-title'>
        {blog.author}: {blog.title}
      </h2>
      <div className='blog-details'>
        <a className='blog-url' href={blog.url}>
          {blog.url}
        </a>
        <div className='blog-likes'>
          likes {blog.likes} {canLike && <button onClick={handleBlogUpdate}>like</button>}
        </div>
        <div className='blog-user'>Added by {blog.user.name}</div>
        {canDelete && <button onClick={handleBlogDelete}>remove</button>}
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
  canLike: PropTypes.bool,
}
