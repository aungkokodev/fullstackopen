import { create } from 'zustand'
import userServices from '../services/login'
import blogServices from '../services/blog'

const useUserStore = create((set) => ({
  user: null,
  actions: {
    login: async (credentials) => {
      const user = await userServices.login(credentials)
      blogServices.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      set(() => ({ user }))
    },
    logout: async () => {
      blogServices.setToken(null)
      window.localStorage.removeItem('loggedBlogappUser')
      set(() => ({ user: null }))
    },
    initialize: async () => {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        blogServices.setToken(user.token)
        set(() => ({ user }))
      }
    },
  },
}))

export const useUser = () => useUserStore((s) => s.user)
export const useUserAction = () => useUserStore((s) => s.actions)
