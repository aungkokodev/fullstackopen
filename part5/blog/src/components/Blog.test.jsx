import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test } from 'vitest'
import Blog from './Blog'

describe('<Blog />', () => {
  let container

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

  beforeEach(() => {
    container = render(<Blog blog={blog} />).container
  })

  test('renders the title and author, but not URL or likes', async () => {
    const blogTitleAndAuthor = container.querySelector('.blog-title')
    expect(blogTitleAndAuthor)
      .toBeDefined()
      .toHaveTextContent(blog.title)
      .toHaveTextContent(blog.author)

    const blogDetails = container.querySelector('.blog-details')
    expect(blogDetails).toHaveStyle({ display: 'none' })
  })

  test('the URL and likes are shown when the view button is clicked', async () => {
    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const blogDetails = container.querySelector('.blog-details')
    expect(blogDetails).not.toHaveStyle({ display: 'none' })
  })
})
