import { useAnecdoteActions, useAnecdotes } from '../stores/anecdotes'
import { useNotificationActions } from '../stores/notification'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote } = useAnecdoteActions()
  const { setNotification } = useNotificationActions()

  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes)

  const handleVote = (anecdote) => {
    vote(anecdote.id)
    setNotification(`You voted '${anecdote.content}'`)
  }

  return sortedAnecdotes.map((anecdote) => (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => handleVote(anecdote)}>vote</button>
      </div>
    </div>
  ))
}

export default AnecdoteList
