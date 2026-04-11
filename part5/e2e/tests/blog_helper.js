const loginWith = async (page, username, password) => {
  await page.locator('input[type=text]').fill(username)
  await page.locator('input[type=password]').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.locator('#blog-title-input').fill(title)
  await page.locator('#blog-author-input').fill(author)
  await page.locator('#blog-url-input').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

export { loginWith, createBlog }
