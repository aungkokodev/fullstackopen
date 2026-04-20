const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0

  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const blog = blogs.reduce((favorite, blog) =>
    blog.likes > favorite.likes ? blog : favorite
  )

  return { title: blog.title, author: blog.author, likes: blog.likes }
}

const mostBlog = (blogs) => {
  if (blogs.length === 0) return null

  const obj = blogs.reduce((set, blog) => {
    if (blog.author in set) set[blog.author] += 1
    else set[blog.author] = 1
    return set
  }, {})

  const [author, count] = Object.entries(obj).reduce((a, c) =>
    a[1] > c[1] ? a : c
  )

  return { author, blogs: count }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const obj = blogs.reduce((set, blog) => {
    if (blog.author in set) set[blog.author] += blog.likes
    else set[blog.author] = blog.likes
    return set
  }, {})

  const [author, likes] = Object.entries(obj).reduce((a, c) =>
    a[1] > c[1] ? a : c
  )

  return { author, likes }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlog, mostLikes }
