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

module.exports = { dummy, totalLikes, favoriteBlog }
