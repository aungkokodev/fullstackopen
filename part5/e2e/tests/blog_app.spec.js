const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog, blogs, users, incrementBlogLikes } = require('./blog_helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: users[0],
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
      await loginWith(page, users[0].username, users[0].password)

      await expect(page.getByText(`${users[0].name} logged in`)).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'user', 'password')

      const noti = page.locator('.error')
      await expect(noti).toContainText('incorrect username or password')
      await expect(noti).toHaveCSS('border-style', 'solid')
      await expect(noti).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText(`${users[0].name} logged in`)).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    const { title, author, url } = blogs[0]

    beforeEach(async ({ page }) => {
      await loginWith(page, users[0].username, users[0].password)
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

      test('only owner sees delete button', async ({ page, request }) => {
        await request.post('/api/users', {
          data: users[1],
        })

        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()

        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, users[1].username, users[1].password)

        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
      })
    })

    describe('and multiple blogs exists', () => {
      beforeEach(async ({ page }) => {
        for (const blog of blogs) {
          await createBlog(page, blog.title, blog.author, blog.url)
        }
      })

      test('blogs are arranged in the order according to likes', async ({ page }) => {
        for (let blog of blogs) {
          await incrementBlogLikes(
            page.locator('.blog').filter({ hasText: blog.title }),
            blog.likes,
          )
        }

        const blogDivs = page.locator('.blog')
        const sortedBlogs = blogs.toSorted((a, b) => b.likes - a.likes)

        for (let i = 0; i < sortedBlogs.length; i++) {
          const { title, likes } = sortedBlogs[i]

          await expect(blogDivs.nth(i)).toContainText(title)
          await expect(blogDivs.nth(i)).toContainText(`likes ${likes}`)
        }
      })
    })
  })
})
