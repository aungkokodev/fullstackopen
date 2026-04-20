import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    id: '67a87ddcd2f30f57f74795b9',
    title: 'CSS Grid Layout Guide',
    author: 'Chris House',
    url: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
    likes: 6,
    user: {
      username: 'steve',
      name: 'Steve',
      id: '67a87827c96780af5bc442d5',
    },
  }

  test('unauthenticated users see blog info and likes but no buttons', async () => {
    const container = render(
      <Blog blog={blog} canLike={false} canDelete={false} />,
    ).container

    expect(container.querySelector('.blog-title'))
      .toBeDefined()
      .toHaveTextContent(blog.title)

    expect(container.querySelector('.blog-author'))
      .toBeDefined()
      .toHaveTextContent(blog.author)

    expect(container.querySelector('.blog-url'))
      .toBeDefined()
      .toHaveAttribute('href', blog.url)
      .toHaveTextContent(blog.url)

    expect(container.querySelector('.blog-user'))
      .toBeDefined()
      .toHaveTextContent(blog.user.name)

    expect(screen.queryByText('likes')).toBeDefined()

    const likeButton = screen.queryByRole('button', { name: 'like' })
    expect(likeButton).not.toBeInTheDocument()

    const deleteButton = screen.queryByRole('button', { name: 'remove' })
    expect(deleteButton).not.toBeInTheDocument()
  })

  test('non creator sees only like button', async () => {
    const user = userEvent.setup()
    const mockHandler = vi.fn()

    render(
      <Blog
        blog={blog}
        updateBlog={mockHandler}
        canLike={true}
        canDelete={false}
      />,
    )

    const likeButton = screen.getByRole('button', { name: 'like' })
    expect(likeButton).toBeInTheDocument().toBeVisible()

    const deleteButton = screen.queryByRole('button', { name: 'remove' })
    expect(deleteButton).not.toBeInTheDocument()

    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  test('creator sees both like and delete buttons', async () => {
    const user = userEvent.setup()
    const mockUpdateHandler = vi.fn()
    const mockDeleteHandler = vi.fn()

    render(
      <Blog
        blog={blog}
        updateBlog={mockUpdateHandler}
        deleteBlog={mockDeleteHandler}
        canLike={true}
        canDelete={true}
      />,
    )

    const likeButton = screen.getByRole('button', { name: 'like' })
    expect(likeButton).toBeInTheDocument().toBeVisible()

    const deleteButton = screen.getByRole('button', { name: 'remove' })
    expect(deleteButton).toBeInTheDocument().toBeVisible()

    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockUpdateHandler.mock.calls).toHaveLength(2)

    vi.spyOn(window, 'confirm').mockReturnValue(true)

    await user.click(deleteButton)
    expect(mockDeleteHandler.mock.calls).toHaveLength(1)
  })
})
