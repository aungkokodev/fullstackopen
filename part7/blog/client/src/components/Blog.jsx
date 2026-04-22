import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import PropTypes from 'prop-types'
import useField from '../hooks/useField'
import { useBlogActions } from '../stores/blog'
import { useLogin } from '../stores/login'
import { useNotificationActions } from '../stores/notification'
import NotFound from './NotFound'

const Blog = ({ blog, updateBlog, deleteBlog, canDelete, canLike }) => {
  const { reset: resetComment, ...comment } = useField('text')
  const blogActions = useBlogActions()
  const auth = useLogin()
  const { notify } = useNotificationActions()

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

  const handleBlogComment = async () => {
    try {
      await blogActions.comment(blog.id, comment.value)
      resetComment()
    } catch (e) {
      notify(e.response.data.error, true)
    }
  }

  if (!blog) return <NotFound />

  return (
    <Paper
      className="blog"
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
        className="blog-title"
        component="h2"
        sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}
      >
        {blog.title}
      </Typography>
      <Typography className="blog-author" component="h3" sx={{ color: 'gray' }}>
        by {blog.author}
      </Typography>
      <a className="blog-url" href={blog.url}>
        {blog.url}
      </a>
      <Typography className="blog-user" component="p" sx={{ color: 'gray' }}>
        Added by {blog.user.name}
      </Typography>
      <Box sx={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
        <span className="blog-likes">{blog.likes} likes</span>
        {canDelete && (
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleBlogDelete}
          >
            remove
          </Button>
        )}
        {canLike && (
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={handleBlogUpdate}
          >
            like
          </Button>
        )}
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography component="h2" sx={{ fontSize: '1.25rem' }}>
          comments
        </Typography>
        {auth && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <TextField {...comment} label="add a comment" size="small" />
            <Button variant="contained" onClick={handleBlogComment}>
              add comment
            </Button>
          </Box>
        )}
        <List sx={{ marginLeft: 1, marginTop: 2 }}>
          {blog.comments.map((comment, i) => (
            <ListItem
              key={i}
              sx={{
                borderLeft: 1,
                borderColor: '#ccc',
                paddingLeft: '20px',
                position: 'relative',
                ':before': {
                  content: '""',
                  position: 'absolute',
                  transform: 'translate(-21px, -16px)',
                  width: 16,
                  height: 32,
                  color: '#ccc',
                  borderBottom: 1,
                  borderLeft: 1,
                  borderBottomLeftRadius: 10,
                },
                ':last-child': {
                  border: 'none',
                  ':before': {
                    transform: 'translate(-20px, -16px)',
                  },
                },
              }}
            >
              <ListItemText>{comment}</ListItemText>
            </ListItem>
          ))}
        </List>
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
