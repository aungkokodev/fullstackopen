import { create } from 'zustand'
import anecdoteServices from '../services/anecdotes'

const asObject = (anecdote) => ({
  content: anecdote,
  votes: 0,
})

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteServices.getAll()
      set(() => ({ anecdotes }))
    },
    add: async (content) => {
      const newAnecdote = await anecdoteServices.create(asObject(content))
      set((state) => ({
        anecdotes: state.anecdotes.concat(newAnecdote),
      }))
    },
    vote: async (id) => {
      const anecdote = get().anecdotes.find((a) => a.id === id)
      console.log('vote=>>>>>>>>>>>>>', anecdote, id)
      const updatedAnecdote = await anecdoteServices.vote(id, {
        ...anecdote,
        votes: anecdote.votes + 1,
      })
      set((state) => ({
        anecdotes: state.anecdotes.map((a) =>
          a.id === id ? updatedAnecdote : a,
        ),
      }))
    },
    remove: async (id) => {
      await anecdoteServices.remove(id)
      set((state) => ({
        anecdotes: state.anecdotes.filter((a) => a.id !== id),
      }))
    },
    setFilter: (value) => set(() => ({ filter: value })),
  },
}))

export default useAnecdoteStore
export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  const sorted = anecdotes.toSorted((a, b) => b.votes - a.votes)

  if (!filter) return sorted
  return sorted.filter((a) => RegExp(filter, 'i').test(a.content))
}
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions)
