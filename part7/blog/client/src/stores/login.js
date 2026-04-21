import { create } from 'zustand'
import loginServices from '../services/login'
import blogServices from '../services/blog'
import storageServices from '../services/persistentUser'

const userLoginService = create((set) => ({
  user: null,
  actions: {
    login: async (credentials) => {
      const user = await loginServices.login(credentials)
      blogServices.setToken(user.token)
      storageServices.saveUser(user)
      set(() => ({ user }))
    },
    logout: async () => {
      blogServices.setToken(null)
      storageServices.removeUser()
      set(() => ({ user: null }))
    },
    initialize: async () => {
      const loggedUserJSON = storageServices.getUser()
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        blogServices.setToken(user.token)
        set(() => ({ user }))
      }
    },
  },
}))

export const useLogin = () => userLoginService((s) => s.user)
export const useLoginActions = () => userLoginService((s) => s.actions)
