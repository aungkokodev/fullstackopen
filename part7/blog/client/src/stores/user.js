import { create } from 'zustand'
import userServices from '../services/user'

const useUserStore = create((set) => ({
  users: [],
  actions: {
    initialize: async () => {
      const users = await userServices.getAll()
      set(() => ({ users }))
    },
  },
}))

export const useUser = () => useUserStore((state) => state.users)
export const useUserActions = () => useUserStore((state) => state.actions)
