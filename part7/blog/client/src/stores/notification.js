import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  notification: { message: '', severity: 'success' },
  actions: {
    notify: (message, isError = false, duration = 3000) => {
      set(() => ({ notification: { message, isError } }))
      setTimeout(() => {
        set(() => ({ notification: { message: '', isError } }))
      }, duration)
    },
  },
}))

export const useNotification = () => useNotificationStore((s) => s.notification)
export const useNotificationActions = () =>
  useNotificationStore((s) => s.actions)
