import { useAnecdoteActions, useAnecdotes } from '../stores/anecdotes'
import { useNotificationActions } from '../stores/notification'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote, remove } = useAnecdoteActions()
  const { setNotification } = useNotificationActions()

  const handleVote = (anecdote) => {
    vote(anecdote.id)
    setNotification(`You voted '${anecdote.content}'`)
  }

  const handleRemove = (anecdote) => {
    remove(anecdote.id)
    setNotification(`You deleted '${anecdote.content}'`)
  }

  return anecdotes.map((anecdote) => (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => handleVote(anecdote)}>vote</button>
        {!anecdote.votes && (
          <button onClick={() => handleRemove(anecdote)}>delete</button>
        )}
      </div>
    </div>
  ))
}

export default AnecdoteList
