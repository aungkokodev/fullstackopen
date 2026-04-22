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
    like: async (blog) => {
      const updatedBlog = await blogServices.update(blog)
      set((state) => ({
        blogs: state.blogs.map((b) =>
          b.id === updatedBlog.id ? updatedBlog : b,
        ),
      }))
    },
    comment: async (id, comment) => {
      const updatedBlog = await blogServices.comment(id, comment)
      set((state) => ({
        blogs: state.blogs.map((b) =>
          b.id === updatedBlog.id ? updatedBlog : b,
        ),
      }))
    },
    remove: async (id) => {
      await blogServices.remove(id)
      set((state) => ({ blogs: state.blogs.filter((b) => b.id !== id) }))
    },
  },
}))

export const useBlog = () => {
  const blogs = useBlogStore((s) => s.blogs)
  return blogs.toSorted((a, b) => b.likes - a.likes)
}
export const useBlogActions = () => useBlogStore((s) => s.actions)
