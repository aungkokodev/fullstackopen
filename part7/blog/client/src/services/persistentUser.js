const getUser = () => window.localStorage.getItem('loggedBlogappUser')

const saveUser = (user) =>
  window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

const removeUser = () => window.localStorage.removeItem('loggedBlogappUser')

export default {
  getUser,
  saveUser,
  removeUser,
}
