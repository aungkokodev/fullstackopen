const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: '679bc9fc2f308b4efe78ef65',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: '679bc9fc2f308b4efe78ef61',
    __v: 0,
  },
  {
    _id: '679bc9fc2f308b4efe78ef69',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: '679bc9fc2f308b4efe78ef61',
    __v: 0,
  },
  {
    _id: '679bc9fc2f308b4efe78ef6d',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user: '679bc9fc2f308b4efe78ef61',
    __v: 0,
  },
  {
    _id: '679bc9fc2f308b4efe78ef71',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    user: '679bc9fc2f308b4efe78ef61',
    __v: 0,
  },
  {
    _id: '679bc9fc2f308b4efe78ef75',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    user: '679bc9fc2f308b4efe78ef61',
    __v: 0,
  },
  {
    _id: '679bc9fc2f308b4efe78ef79',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    user: '679bc9fc2f308b4efe78ef61',
    __v: 0,
  },
]

const initialUsers = [
  {
    _id: '679bc9fc2f308b4efe78ef61',
    username: 'steve',
    passwordHash:
      '$2b$10$jVMUlnVy.aE5kHz8P2ZGeuvmGCW9ccK/txmZUdUtzmGrUPgKq2tjm',
    name: 'Steve',
    blogs: [
      '679bc9fc2f308b4efe78ef65',
      '679bc9fc2f308b4efe78ef69',
      '679bc9fc2f308b4efe78ef6d',
      '679bc9fc2f308b4efe78ef71',
      '679bc9fc2f308b4efe78ef75',
      '679bc9fc2f308b4efe78ef79',
    ],
    __v: 6,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((b) => b.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = { initialBlogs, blogsInDb, initialUsers, usersInDb }
