const jwt = require('jsonwebtoken')
const morgan = require('morgan')
const logger = require('./logger')
const User = require('../models/user')

morgan.token('body', (request) => JSON.stringify(request.body))

const requestLogger =
  process.env.NODE_ENV !== 'test'
    ? morgan(
        ':method :url :status :res[content-length] - :response-time ms :body'
      )
    : (request, response, next) => next()

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  )
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' })
  else if (error.name === 'JsonWebTokenError')
    return response.status(401).json({ error: 'token invalid' })
  else if (error.name === 'TokenExpiredError')
    return response.status(401).json({ error: 'token expired' })

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer '))
    request.token = authorization.replace('Bearer ', '')
  else request.token = null

  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const user = await User.findById(decodedToken.id)
  request.user = user

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
