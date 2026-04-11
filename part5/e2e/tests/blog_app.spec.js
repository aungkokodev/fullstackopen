const { test, expect, describe, beforeEach } = require('@playwright/test')

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
      await page.locator('input[type=text]').fill('steve')
      await page.locator('input[type=password]').fill('secret')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Steve logged in')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.locator('input[type=text]').fill('steve')
      await page.locator('input[type=password]').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      const noti = page.locator('.error')

      await expect(noti).toContainText('incorrect username or password')
      await expect(noti).toHaveCSS('border-style', 'solid')
      await expect(noti).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Steve logged in')).not.toBeVisible()
    })
  })
})
