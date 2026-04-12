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
    const title = 'Getting Started with JavaScript'
    const author = 'Jane Doe'
    const url = 'http://example.com/blogs/123'

    beforeEach(async ({ page }) => {
      await loginWith(page, 'steve', 'secret')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, title, author, url)

      await expect(page.getByText(`a new blog ${title} by ${author} added`)).toBeVisible()
      await expect(page.getByText(`${title} ${author}`)).toBeVisible()
      await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, title, author, url)
      })

      test('blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('likes 0')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('blog can be deleted by owner', async ({ page }) => {
        page.on('dialog', async (dialog) => {
          await dialog.accept()
        })

        await expect(page.locator('.blog')).toHaveCount(1)
        await expect(page.getByText(`${title} ${author}`)).toBeVisible()

        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'delete' }).click()

        await expect(page.locator('.noti')).toHaveText(`Successfully deleted ${title} by ${author}`)
        await expect(page.locator('.blog')).toHaveCount(0)
        await expect(page.getByText(`${title} ${author}`)).not.toBeVisible()
      })
    })
  })
})
