const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./blog_helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Steve',
        username: 'steve',
        password: 'secret',
      },
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.locator('input[type=text]')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.locator('input[type=password]')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'steve', 'secret')

      await expect(page.getByText('Steve logged in')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'steve', 'password')

      const noti = page.locator('.error')
      await expect(noti).toContainText('incorrect username or password')
      await expect(noti).toHaveCSS('border-style', 'solid')
      await expect(noti).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Steve logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'steve', 'secret')
    })

    test('a new blog can be created', async ({ page }) => {
      const title = 'Getting Started with JavaScript'
      const author = 'Jane Doe'
      const url = 'http://example.com/blogs/123'

      await createBlog(page, title, author, url)

      await expect(page.getByText(`a new blog ${title} by ${author} added`)).toBeVisible()
      await expect(page.getByText(`${title} ${author}`)).toBeVisible()
      await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
    })
  })
})
