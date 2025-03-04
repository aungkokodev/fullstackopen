import PropTypes from 'prop-types'
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>create new</h1>
      <div>
        <label>title:</label>
        <input
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          id="blog-title-input"
        />
      </div>
      <div>
        <label>author:</label>
        <input
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          id="blog-author-input"
        />
      </div>
      <div>
        <label>url:</label>
        <input
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          id="blog-url-input"
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm

BlogForm.propTypes = {
  createBlog: PropTypes.func,
}
