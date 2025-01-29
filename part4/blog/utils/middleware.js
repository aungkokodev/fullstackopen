const morgan = require('morgan')
const logger = require('./logger')

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

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
}
