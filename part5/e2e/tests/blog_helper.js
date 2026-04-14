const loginWith = async (page, username, password) => {
  await page.getByRole('link', { name: 'login' }).click()
  await page.locator('input[type=text]').fill(username)
  await page.locator('input[type=password]').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.locator('#blog-title-input').fill(title)
  await page.locator('#blog-author-input').fill(author)
  await page.locator('#blog-url-input').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

const incrementBlogLikes = async (blog, count) => {
  await blog.getByRole('button', { name: 'view' }).click()
  for (let i = 0; i < count; i++) {
    await blog.getByRole('button', { name: 'like' }).click()
  }
}

const users = [
  {
    name: 'Steve',
    username: 'steve',
    password: 'secret1',
  },
  {
    name: 'John',
    username: 'john',
    password: 'secret2',
  },
]

const blogs = [
  {
    title: 'Mastering JavaScript Closures',
    author: 'Alex Morgan',
    url: 'https://example.com/js-closures',
    likes: 2,
  },
  {
    title: 'Building Scalable APIs with Nodejs',
    author: 'Priya Sharma',
    url: 'https://example.com/nodejs-apis',
    likes: 1,
  },
  {
    title: 'React Performance Optimization',
    author: 'Daniel Lee',
    url: 'https://example.com/react-performance',
    likes: 3,
  },
]

export { loginWith, createBlog, incrementBlogLikes, blogs, users }
