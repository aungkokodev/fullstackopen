const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect))
    return response
      .status(400)
      .json({ error: 'incorrect username or password' })

  const payload = {
    username,
    id: user._id,
  }

  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: 10 })

  response.status(200).json({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
