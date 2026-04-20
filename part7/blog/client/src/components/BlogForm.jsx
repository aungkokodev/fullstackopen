import { Button, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    try {
      event.preventDefault()
      await createBlog({ title, author, url })
      setTitle('')
      setAuthor('')
      setUrl('')
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
          type='text'
          label='title'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          id='blog-title-input'
          size='small'
          sx={{ marginBottom: 2 }}
        />
      </div>
      <div>
        <TextField
          type='text'
          label='author'
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          id='blog-author-input'
          size='small'
          sx={{ marginBottom: 2 }}
        />
      </div>
      <div>
        <TextField
          type='text'
          label='url'
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          id='blog-url-input'
          size='small'
          sx={{ marginBottom: 2 }}
        />
      </div>
      <Button type='submit' variant='contained'>
        create
      </Button>
    </form>
  )
}

export default BlogForm

BlogForm.propTypes = {
  createBlog: PropTypes.func,
}
