import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  notification: null,
  actions: {
    setNotification: (notification, duration = 3000) => {
      set(() => ({ notification }))

      setTimeout(() => {
        set(() => ({ notification: null }))
      }, duration)
    },
  },
}))

export const useNotification = () => useNotificationStore((s) => s.notification)
export const useNotificationActions = () =>
  useNotificationStore((s) => s.actions)
