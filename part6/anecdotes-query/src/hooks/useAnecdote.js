import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { create, getAll, update } from '../services/anecdotes'

export const useAnecdote = () => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const createMutation = useMutation({
    mutationFn: create,
    onSuccess: (anecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(anecdote))
    },
  })

  const updateMutation = useMutation({
    mutationFn: update,
    onSuccess: (anecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map((a) => (a.id !== anecdote.id ? a : anecdote)),
      )
    },
  })

  return {
    anecdotes: query.data,
    isPending: query.isPending,
    createAnecdote: (anecdote) => createMutation.mutate(anecdote),
    voteAnecdote: (anecdote) =>
      updateMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 }),
  }
}
