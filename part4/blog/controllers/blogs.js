const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((savedBlog) => {
    response.status(201).json(savedBlog)
  })
})

module.exports = blogRouter
