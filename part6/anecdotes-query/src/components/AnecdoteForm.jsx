import { useContext } from 'react'
import { useAnecdote } from '../hooks/useAnecdote'
import NotificationContext from '../Context/NotificationContext'

const AnecdoteForm = () => {
  const { createAnecdote } = useAnecdote()
  const { notify } = useContext(NotificationContext)

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()
    createAnecdote({ content, votes: 0 })
    notify(`anecdote '${content}' created`)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
