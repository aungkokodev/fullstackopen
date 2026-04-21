import { create } from 'zustand'
import loginServices from '../services/login'
import blogServices from '../services/blog'
import userServices from '../services/persistentUser'

const useUserStore = create((set) => ({
  user: null,
  actions: {
    login: async (credentials) => {
      const user = await loginServices.login(credentials)
      blogServices.setToken(user.token)
      userServices.saveUser(user)
      set(() => ({ user }))
    },
    logout: async () => {
      blogServices.setToken(null)
      userServices.removeUser()
      set(() => ({ user: null }))
    },
    initialize: async () => {
      const loggedUserJSON = userServices.getUser()
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
