import { Button, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import useField from '../useField'

const BlogForm = ({ createBlog }) => {
  const { reset: resetTitle, ...title } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetUrl, ...url } = useField('text')

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    try {
      event.preventDefault()
      await createBlog({
        title: title.value,
        author: author.value,
        url: url.value,
      })
      resetTitle('')
      resetAuthor('')
      resetUrl('')
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>create new</h2>
      <div>
        <TextField
          {...title}
          label="title"
          id="blog-title-input"
          size="small"
          sx={{ marginBottom: 2 }}
        />
      </div>
      <div>
        <TextField
          {...author}
          label="author"
          id="blog-author-input"
          size="small"
          sx={{ marginBottom: 2 }}
        />
      </div>
      <div>
        <TextField
          {...url}
          label="url"
          id="blog-url-input"
          size="small"
          sx={{ marginBottom: 2 }}
        />
      </div>
      <Button type="submit" variant="contained">
        create
      </Button>
    </form>
  )
}

export default BlogForm

BlogForm.propTypes = {
  createBlog: PropTypes.func,
}
