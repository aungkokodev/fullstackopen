const { describe, expect, test, beforeEach } = require('@playwright/test')
const { users, loginWith, createBlog, blogs } = require('./blog_helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: users[0],
    })
    await request.post('/api/users', {
      data: users[1],
    })
    await page.goto('/')
  })

  describe('Login', () => {
    test('succeeds with correct username and password', async ({ page }) => {
      await loginWith(page, users[0].username, users[0].password)

      await expect(page.getByRole('link', { name: 'new blog' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with incorrect username and password', async ({ page }) => {
      await loginWith(page, 'username', 'password')

      await expect(page.getByText(/incorrect username or password/i)).toBeVisible()
      await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'new blog' })).not.toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).not.toBeVisible()
    })
  })

  describe('When Login', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, users[0].username, users[0].password)
    })

    test('logged in user can create a blog', async ({ page }) => {
      await createBlog(page, blogs[0].title, blogs[0].author, blogs[0].url)

      await expect(page.getByRole('link', { name: blogs[0].title })).toBeVisible()
    })

    describe('and several blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, blogs[0].title, blogs[0].author, blogs[0].url)
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, users[1].username, users[1].password)
        await createBlog(page, blogs[1].title, blogs[1].author, blogs[1].url)
      })

      test('logged in user can like blogs', async ({ page }) => {
        await page.getByRole('link', { name: blogs[0].title }).click()
        await expect(page.getByText('likes 0')).toBeVisible()

        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()

        await page.getByRole('link', { name: 'blogs' }).click()

        await page.getByRole('link', { name: blogs[1].title }).click()
        await expect(page.getByText('likes 0')).toBeVisible()

        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('logged in user can delete a blog', async ({ page }) => {
        page.on('dialog', (dialog) => dialog.accept())

        await page.getByRole('link', { name: blogs[1].title }).click()
        await page.getByRole('button', { name: 'remove' }).click()

        expect(page.getByRole('link', { name: blogs[1].title })).not.toBeVisible()
      })
    })
  })
})
