import { create } from 'zustand'
import blogServices from '../services/blog'

const useBlogStore = create((set) => ({
  blogs: [],
  actions: {
    initialize: async () => {
      const blogs = await blogServices.getAll()
      set(() => ({ blogs }))
    },
    create: async (blog) => {
      const newBlog = await blogServices.create(blog)
      set((state) => ({ blogs: state.blogs.concat(newBlog) }))
    },
  },
}))

export const useBlog = () => useBlogStore((s) => s.blogs)
export const useBlogActions = () => useBlogStore((s) => s.actions)
