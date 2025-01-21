const morgan = require('morgan')
const logger = require('./logger')

morgan.token('body', (request) => JSON.stringify(request.body))

const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
}
