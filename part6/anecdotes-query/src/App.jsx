import { useContext } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useAnecdote } from './hooks/useAnecdote'
import NotificationContext from './Context/NotificationContext'

const App = () => {
  const { anecdotes, isPending, voteAnecdote } = useAnecdote()

  const { notify } = useContext(NotificationContext)

  if (isPending) return <div>loading data...</div>

  const handleVote = (anecdote) => {
    voteAnecdote(anecdote)
    notify(`anecdote '${anecdote.content}' voted`)
  }

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
