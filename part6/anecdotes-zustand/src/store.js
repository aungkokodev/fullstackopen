import { create } from 'zustand'
import anecdoteServices from './services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => ({
  content: anecdote,
  id: getId(),
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
    add: (content) =>
      set((state) => ({
        anecdotes: state.anecdotes.concat(asObject(content)),
      })),
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
