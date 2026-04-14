import { Box, Button, Paper, Typography } from '@mui/material'
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
    <Paper
      className='blog'
      sx={{
        padding: '1rem',
        marginTop: '1rem',
        fontFamily: 'sans-serif',
        display: 'flex',
        flexFlow: 'column',
        gap: '.5rem',
      }}
    >
      <Typography
        className='blog-title'
        component='h2'
        sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}
      >
        {blog.title}
      </Typography>
      <Typography className='blog-author' component='h3' sx={{ color: 'gray' }}>
        by {blog.author}
      </Typography>
      <a className='blog-url' href={blog.url}>
        {blog.url}
      </a>
      <Typography className='blog-user' component='p' sx={{ color: 'gray' }}>
        Added by {blog.user.name}
      </Typography>
      <Box sx={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
        <span className='blog-likes'>{blog.likes} likes</span>
        {canDelete && (
          <Button
            variant='outlined'
            size='small'
            color='error'
            onClick={handleBlogDelete}
          >
            remove
          </Button>
        )}
        {canLike && (
          <Button
            variant='outlined'
            size='small'
            color='primary'
            onClick={handleBlogUpdate}
          >
            like
          </Button>
        )}
      </Box>
    </Paper>
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
