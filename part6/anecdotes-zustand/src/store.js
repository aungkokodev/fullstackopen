import { create } from 'zustand'
import anecdoteServices from './services/anecdotes'

const asObject = (anecdote) => ({
  content: anecdote,
  votes: 0,
})

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteServices.getAll()
      set(() => ({ anecdotes }))
    },
    vote: (id) =>
      set((state) => ({
        anecdotes: state.anecdotes.map((a) =>
          a.id === id ? { ...a, votes: a.votes + 1 } : a,
        ),
      })),
    add: async (content) => {
      const newAnecdote = await anecdoteServices.create(asObject(content))
      set((state) => ({
        anecdotes: state.anecdotes.concat(newAnecdote),
      }))
    },
    setFilter: (value) => set(() => ({ filter: value })),
  },
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)

  if (!filter) return anecdotes
  return anecdotes.filter((a) => RegExp(filter, 'i').test(a.content))
}
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions)
