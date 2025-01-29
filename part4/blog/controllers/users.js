const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

userRouter.get('/', async (request, response) => {
  const users = await User.find({})

  response.status(200).json(users)
})

userRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body

  if (!password || password.length < 3)
    return response
      .status(400)
      .json({ error: 'password must be at least 3 characters long' })

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
    name,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = userRouter
