const { test, expect, describe, beforeEach } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible();
    await expect(page.getByText('username')).toBeVisible();
    await expect(page.locator('input[type=text]')).toBeVisible();
    await expect(page.getByText('password')).toBeVisible();
    await expect(page.locator('input[type=password]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
  });
});
