import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('the form calls the event handler with the right details when a new blog is created', async () => {
    const blog = {
      title: 'CSS Grid Layout Guide',
      author: 'Chris House',
      url: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
    }

    const mockHandler = vi.fn()

    const { container } = render(<BlogForm createBlog={mockHandler} />)

    const blogTitleInput = container.querySelector('#blog-title-input')
    const blogAuthorInput = container.querySelector('#blog-author-input')
    const blogUrlInput = container.querySelector('#blog-url-input')
    const createButton = screen.getByText('create')

    const user = userEvent.setup()
    await user.type(blogTitleInput, blog.title)
    await user.type(blogAuthorInput, blog.author)
    await user.type(blogUrlInput, blog.url)
    await user.click(createButton)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0].title).toBe(blog.title)
    expect(mockHandler.mock.calls[0][0].author).toBe(blog.author)
    expect(mockHandler.mock.calls[0][0].url).toBe(blog.url)
  })
})
