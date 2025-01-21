const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((savedBlog) => {
    response.status(201).json(savedBlog)
  })
})

module.exports = blogRouter
