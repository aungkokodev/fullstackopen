const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../utils/blog_helper')

const api = supertest(app)

describe('blog api', () => {
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

  test('if the likes property is missing, it will default to the value 0', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
    }

    const savedBlog = await api.post('/api/blogs').send(newBlog)
    assert.strictEqual(savedBlog.body.likes, 0)
  })

  test('if the title or url properties are missing, responds with the status code 400', async () => {
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

  test('blog with valid id can be deleted', async () => {
    const blogToDelete = {
      id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
    }

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert(blogsAtEnd.every((blog) => blog.id !== blogToDelete.id))
  })

  test('blog post can be updated', async () => {
    const blogToUpdate = {
      id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 35,
    }

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)

    assert.deepStrictEqual(updatedBlog.body, blogToUpdate)
  })
})

describe('user api', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const userObjects = helper.initialUsers.map((user) => new User(user))
    const promiseArray = userObjects.map((obj) => obj.save())
    await Promise.all(promiseArray)
  })

  test('valid user can be created', async () => {
    const user = {
      username: 'steve',
      password: 'steve',
      name: 'Steve',
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    const usernames = usersAtEnd.map((user) => user.username)

    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)
    assert(usernames.includes(user.username))
  })

  test('username must be unique', async () => {
    const user = {
      username: 'rose',
      password: 'rose',
      name: 'Rose',
    }

    await api.post('/api/users').send(user).expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
  })

  test('both username and password must be at least 3 characters long', async () => {
    const userWithInvalidUsername = {
      username: 'st',
      password: 'steve',
      name: 'Steve',
    }

    const userWithInvalidPassword = {
      username: 'steve',
      password: 'st',
      name: 'Steve',
    }

    await api.post('/api/users').send(userWithInvalidUsername).expect(400)
    await api.post('/api/users').send(userWithInvalidPassword).expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
  })
})

after(async () => {
  mongoose.connection.close()
})
