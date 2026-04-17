import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAll, update } from './services/anecdotes'

const App = () => {
  const queryClient = useQueryClient()

  const { data: anecdotes, isPending } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    refetchOnWindowFocus: false,
    retry: 1,
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

  const handleVote = (anecdote) => {
    updateMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  if (isPending) return <div>loading data...</div>

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
