const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('../utils/blog_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('there are six blogs', async () => {
  const blogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(blogs.body.length, helper.initialBlogs.length)
})

test('the unique identifier property of the blog posts is named id', async () => {
  const blogs = await api.get('/api/blogs')

  const result = blogs.body.every((blog) => !!blog.id)
  assert(result)
})

test('successfully creates a new blog post', async () => {
  const newBlog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  }

  const savedBlog = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  delete savedBlog.body.id
  assert.deepStrictEqual(savedBlog.body, newBlog)
})

test('if the likes property is missing from the request, it will default to the value 0', async () => {
  const newBlog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
  }

  const savedBlog = await api.post('/api/blogs').send(newBlog)
  assert.strictEqual(savedBlog.body.likes, 0)
})

test('if the title or url properties are missing from the request data, the backend responds to the request with the status code 400', async () => {
  const blogWithMissingTitle = {
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  }

  const blogWithMissingUrl = {
    title: 'React patterns',
    author: 'Michael Chan',
    likes: 7,
  }

  await api.post('/api/blogs').send(blogWithMissingTitle).expect(400)
  await api.post('/api/blogs').send(blogWithMissingUrl).expect(400)
})

after(async () => {
  mongoose.connection.close()
})
