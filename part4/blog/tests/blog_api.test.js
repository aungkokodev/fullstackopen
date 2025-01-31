const { test, after, describe, beforeEach } = require('node:test')
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
    await User.deleteMany({})

    for (let blog of helper.initialBlogs) {
      const blogObj = new Blog(blog)
      await blogObj.save()
    }

    for (let user of helper.initialUsers) {
      const userObj = new User(user)
      await userObj.save()
    }
  })

  /* */
  test('there are six blogs', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(blogs.body.length, helper.initialBlogs.length)
  })

  /* */
  test('the unique identifier property of the blog posts is named id', async () => {
    const blogs = await api.get('/api/blogs')

    const result = blogs.body.every((blog) => !!blog.id)
    assert(result)
  })

  /* */
  test('request fail if token is not provided', async () => {
    const blog = {
      title: 'Node api testing',
      author: 'Steve',
      url: 'https://reactpatterns.com/',
      likes: 7,
    }

    await api.post('/api/blogs').send(blog).expect(401)
    await api.delete(`/api/blogs/${blog._id}`).expect(401)
  })

  /* */
  test('new blog post can be created', async () => {
    const newBlog = {
      title: 'Node api testing',
      author: 'Steve',
      url: 'https://reactpatterns.com/',
      likes: 7,
    }

    const { body } = await api
      .post('/api/login')
      .send({ username: 'steve', password: 'steve' })

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    assert(titles.includes(newBlog.title))
  })

  /* */
  test('if the likes property is missing, it will default to the value 0', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
    }

    const { body } = await api
      .post('/api/login')
      .send({ username: 'steve', password: 'steve' })

    const savedBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${body.token}`)
      .send(newBlog)
    assert.strictEqual(savedBlog.body.likes, 0)
  })

  /* */
  test('if the title or url are missing, responds with the stauts code 400', async () => {
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

    const { body } = await api
      .post('/api/login')
      .send({ username: 'steve', password: 'steve' })

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${body.token}`)
      .send(blogWithMissingTitle)
      .expect(400)
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${body.token}`)
      .send(blogWithMissingUrl)
      .expect(400)
  })

  /* */
  test('blog post can be deleted', async () => {
    const blogToDelete = helper.initialBlogs[0]

    const { body } = await api
      .post('/api/login')
      .send({ username: 'steve', password: 'steve' })

    await api
      .delete(`/api/blogs/${blogToDelete._id}`)
      .set('Authorization', `Bearer ${body.token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert(blogsAtEnd.every((blog) => blog.id !== blogToDelete.id))
  })

  /* */
  test('blog post can be updated', async () => {
    const blogToUpdate = { ...helper.initialBlogs[0] }
    blogToUpdate.title = 'Updated blog title'

    await api
      .put(`/api/blogs/${blogToUpdate._id}`)
      .send(blogToUpdate)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map((blog) => blog.title)
    assert(titles.includes(blogToUpdate.title))
  })
})

describe('user api', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const userObjects = helper.initialUsers.map((user) => new User(user))
    const promiseArray = userObjects.map((obj) => obj.save())
    await Promise.all(promiseArray)
  })

  test('new user can be created', async () => {
    const user = {
      username: 'rose',
      password: 'rose',
      name: 'Rose',
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
      username: 'steve',
      password: 'steve',
      name: 'Steve',
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
