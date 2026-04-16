import { useAnecdoteActions } from '../stores/anecdotes'
import { useNotificationActions } from '../stores/notification'

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()
  const { setNotification } = useNotificationActions()

  const handleSubmit = (event) => {
    event.preventDefault()
    const content = event.target.content.value
    add(content)
    setNotification(`You created '${content}'`)
    event.target.reset()
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name='content' />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
